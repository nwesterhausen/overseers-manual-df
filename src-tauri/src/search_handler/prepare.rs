use dfraw_json_parser::{
    creature::Creature,
    get_search_string,
    graphics::{Graphic, TilePage},
    helpers::clone_raw_object_box,
    inorganic::Inorganic,
    plant::Plant,
    ModuleInfoFile, ObjectType, ParserOptions, ProgressPayload, ProgressTask, RawObject,
};
use serde_json::json;
use tauri::{AppHandle, Manager, State, Window};
use tauri_plugin_aptabase::EventTracker;

use crate::{
    search_handler::summary::Summary,
    state::{GraphicStorage, ModuleInfoStorage, Storage},
    tracking::ParseAndStoreRaws,
};

/// Parses the raws with the given options and stores them in the storage.
///
/// # Arguments
///
/// * `options` - The options to use for parsing the raws.
/// * `window` - (Passed transparently) The window to emit progress events to.
/// * `storage` - (Passed transparently) The storage to store the raws in.
/// * `graphics_storage` - (Passed transparently) The graphics storage to store the graphics in.
/// * `module_info_storage` - (Passed transparently) The module info storage to store the module info files in.
/// * `app_handle` - (Passed transparently) The handle to the application to track events with.
///
/// # Returns
///
/// Returns `Ok(())` if the raws were parsed and stored successfully, or `Err(())` if there was an error.
///
/// # Errors
///
/// This function will return an error if there was an error parsing the raws.
///
/// # Panics
///
/// This function panics if any of the storage mutexes are poisoned.
#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub async fn parse_and_store_raws(
    options: ParserOptions,
    window: Window,
    storage: State<'_, Storage>,
    graphics_storage: State<'_, GraphicStorage>,
    module_info_storage: State<'_, ModuleInfoStorage>,
    app_handle: AppHandle,
) -> Result<(), ()> {
    log::info!(
        "parse_and_store_raws: parsing raws with options\n{:#?}",
        options
    );
    let start = std::time::Instant::now();
    // Get the raws with given options (and progress)
    let mut raws_vec = Vec::new();
    let mut info_vec = Vec::new();
    match dfraw_json_parser::parse_with_tauri_emit(&options, window.clone()) {
        Ok(result) => {
            raws_vec.extend(result.raws);
            info_vec.extend(result.info_files);
        }
        Err(e) => {
            log::error!("Failure parsing: {e:?}");
        }
    };
    let total_raws = raws_vec.len();
    let duration = start.elapsed();

    // Store the info files in the storage, after clearing it
    #[allow(clippy::unwrap_used)]
    module_info_storage
        .module_info_store
        .lock()
        .unwrap()
        .clear();
    #[allow(clippy::unwrap_used)]
    module_info_storage
        .module_info_store
        .lock()
        .unwrap()
        .extend(info_vec);

    // Build summary
    let mut summary = Summary::from_results(
        &raws_vec,
        &options.object_types_to_parse,
        &options.locations_to_parse,
    );

    let start2 = std::time::Instant::now();
    // Store the raws in the storage, after clearing it
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().clear();
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().extend(raws_vec);

    let duration2 = start2.elapsed();
    let duration2_total = start.elapsed();
    let start3 = std::time::Instant::now();
    // Tracking data.
    log::info!(
        "parse_and_store_raws: {} raws stored in {}; search lookup updated in {}; total time: {}; objects allowed: {:?}; locations: {:?}",
        total_raws,
        format!("{:?}", duration),
        format!("{:?}", duration2),
        format!("{:?}", duration2_total),
        options.object_types_to_parse,
        options.locations_to_parse,
    );
    app_handle.track_event(
        "parse_and_store_raws",
        Some(
            serde_json::to_string(&ParseAndStoreRaws {
                total_raws_parsed: total_raws,
                elapsed_time: format!("{duration2_total:?}"),
                parsed_raw_types: json!(options.object_types_to_parse).to_string(),
                parsed_raw_locations: json!(options.locations_to_parse).to_string(),
            })
            .unwrap_or_default()
            .into(),
        ),
    );

    window
        .emit(
            "PROGRESS",
            ProgressPayload {
                current_task: ProgressTask::ParseRaws,
                ..Default::default()
            },
        )
        .unwrap_or_else(|err| {
            log::warn!("parse_and_store_raws: failed to emit progress event\n{err:?}");
        });

    // Update the search lookup table
    update_search_lookup(&storage);

    // Update the graphics store
    update_graphics_store(&storage, &graphics_storage);

    // Update the tile page store
    update_tile_page_store(&storage, &graphics_storage);

    let duration3 = start3.elapsed();

    summary.set_parsing_duration(duration);
    summary.set_save_to_store_duration(duration2);
    summary.set_filtering_duration(duration3);

    log::info!("{:#?}", summary);
    window.emit("PARSE_SUMMARY", summary).unwrap_or_else(|err| {
        log::warn!("parse_and_store_raws: failed to emit summary event\n{err:?}");
    });

    Ok(())
}

#[allow(clippy::needless_pass_by_value)]
fn update_search_lookup(storage: &State<Storage>) {
    let start = std::time::Instant::now();
    // Get the search lookup table length
    #[allow(clippy::unwrap_used)]
    let previous_length = storage.search_lookup.lock().unwrap().len();
    // Clear the search lookup table
    #[allow(clippy::unwrap_used)]
    storage.search_lookup.lock().unwrap().clear();
    let reset_duration = start.elapsed();
    let start2 = std::time::Instant::now();
    // Get the raws from the storage
    #[allow(clippy::unwrap_used)]
    let raws = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .map(clone_raw_object_box)
        .collect::<Vec<Box<dyn RawObject>>>();
    let clone_duration = start2.elapsed();
    let start2 = std::time::Instant::now();
    // Iterate over the raws
    for (index, raw) in raws.iter().enumerate() {
        // Get the search string for the raw (after casting it to a searchable object)
        let search_string = match raw.get_type() {
            ObjectType::Creature => raw
                .as_any()
                .downcast_ref::<Creature>()
                .map_or_else(String::new, |creature| get_search_string(creature)),
            ObjectType::Plant => raw
                .as_any()
                .downcast_ref::<Plant>()
                .map_or_else(String::new, |plant| get_search_string(plant)),
            ObjectType::Inorganic => raw
                .as_any()
                .downcast_ref::<Inorganic>()
                .map_or_else(String::new, |inorganic| get_search_string(inorganic)),
            _ => {
                // Search provided only for creatures, plants and inorganics at this time.
                String::new()
            }
        };

        if search_string.is_empty() {
            continue;
        }
        // Add the name to the search lookup table
        #[allow(clippy::unwrap_used)]
        storage
            .search_lookup
            .lock()
            .unwrap()
            .push((search_string, index));
    }

    let filter_duration = start2.elapsed();
    let duration = start.elapsed();

    #[allow(clippy::unwrap_used)]
    let current_length = storage.search_lookup.lock().unwrap().len();

    log::info!(
        "update_search_lookup: Search Tables Updates. Previous: {} entries Current: {} entries\nTimes: reset: {}, clone: {}, filter: {}, total: {}",
        previous_length,
        current_length,
        format!("{:?}", reset_duration),
        format!("{:?}", clone_duration),
        format!("{:?}", filter_duration),
        format!("{:?}", duration),
    );
}

#[allow(clippy::needless_pass_by_value)]
fn update_graphics_store(storage: &State<Storage>, graphics_storage: &State<GraphicStorage>) {
    let start = std::time::Instant::now();
    // Get only the graphics raws and store them in the graphics store
    #[allow(clippy::unwrap_used)]
    let graphics = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .filter(|raw| raw.get_type() == &ObjectType::Graphics)
        .map(|r| r.as_any().downcast_ref::<Graphic>().unwrap().clone())
        .collect::<Vec<Graphic>>();

    // Clear the graphics store
    #[allow(clippy::unwrap_used)]
    graphics_storage.graphics_store.lock().unwrap().clear();

    let total_graphics = graphics.len();
    // Insert the graphics into the graphics store
    for graphic in graphics {
        #[allow(clippy::unwrap_used)]
        graphics_storage
            .graphics_store
            .lock()
            .unwrap()
            .entry(graphic.get_identifier().to_string())
            .or_default()
            .push(graphic.clone());
    }
    let duration = start.elapsed();

    log::info!(
        "update_graphics_store: Graphics Store Updated. Total: {} entries in {}",
        total_graphics,
        format!("{:?}", duration),
    );
}

#[allow(clippy::needless_pass_by_value)]
fn update_tile_page_store(storage: &State<Storage>, graphics_storage: &State<GraphicStorage>) {
    let start = std::time::Instant::now();
    // Get only the tile pages raws and store them in the tile page store
    #[allow(clippy::unwrap_used)]
    let tile_pages = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .filter(|raw| raw.get_type() == &ObjectType::TilePage)
        .map(|r| r.as_any().downcast_ref::<TilePage>().unwrap().clone())
        .collect::<Vec<TilePage>>();

    // Clear the tile page store
    #[allow(clippy::unwrap_used)]
    graphics_storage.tile_page_store.lock().unwrap().clear();

    let total_tile_pages = tile_pages.len();
    // Insert the tile pages into the tile page store
    for tile_page in tile_pages {
        #[allow(clippy::unwrap_used)]
        graphics_storage
            .tile_page_store
            .lock()
            .unwrap()
            .insert(tile_page.get_identifier().to_string(), tile_page.clone());
    }
    let duration = start.elapsed();

    log::info!(
        "update_tile_page_store: Tile Page Store Updated. Total: {} entries in {}",
        total_tile_pages,
        format!("{:?}", duration),
    );
}

/// Returns the module info files stored in the module info storage.
///
/// # Arguments
///
/// * `module_info_storage` - (Passed transparently) The module info storage to get the module info files from.
///
/// # Returns
///
/// Returns a vector of the module info files stored in the module info storage.
///
/// # Panics
///
/// This function panics if the module info storage mutex is poisoned.
///
/// # Errors
///
/// This function will return an error if the module info files cannot be retrieved.
#[tauri::command]
pub async fn get_module_info_files(
    module_info_storage: State<'_, ModuleInfoStorage>,
) -> Result<Vec<ModuleInfoFile>, ()> {
    #[allow(clippy::unwrap_used)]
    Ok(module_info_storage
        .module_info_store
        .lock()
        .unwrap()
        .iter()
        .cloned()
        .collect::<Vec<ModuleInfoFile>>())
}
