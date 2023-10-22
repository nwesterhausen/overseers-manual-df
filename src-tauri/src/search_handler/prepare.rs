use dfraw_json_parser::{
    options::ParserOptions,
    parser::{
        creature::raw::Creature, helpers::clone_raw_object_box::clone_raw_object_box,
        inorganic::raw::Inorganic, object_types::ObjectType, plant::raw::Plant, raws::RawObject,
        searchable::get_search_string,
    },
};
use serde_json::json;
use std::sync::Mutex;
use tauri::{AppHandle, State, Window};
use tauri_plugin_aptabase::EventTracker;

use crate::tracking::ParseAndStoreRaws;

pub struct Storage {
    pub store: Mutex<Vec<Box<dyn RawObject>>>,
    pub search_lookup: Mutex<Vec<(String, usize)>>,
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn parse_and_store_raws(
    options: ParserOptions,
    window: Window,
    storage: State<Storage>,
    app_handle: AppHandle,
) {
    log::info!(
        "parse_and_store_raws: parsing raws with options\n{:#?}",
        options
    );
    let start = std::time::Instant::now();
    // Get the raws with given options (and progress)
    let raws_vec = dfraw_json_parser::parse_with_tauri_emit(&options, window);
    let total_raws = raws_vec.len();
    let duration = start.elapsed();
    let start2 = std::time::Instant::now();
    // Store the raws in the storage, after clearing it
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().clear();
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().extend(raws_vec);

    let duration2 = start2.elapsed();
    let duration2_test = start.elapsed();

    // Tracking data.
    log::info!(
        "parse_and_store_raws: {} raws stored in {}; search lookup updated in {}; total time: {}; objects allowed: {:?}; locations: {:?}",
        total_raws,
        format!("{:?}", duration),
        format!("{:?}", duration2),
        format!("{:?}", duration2_test),
        options.raws_to_parse,
        options.locations_to_parse,
    );
    app_handle.track_event(
        "parse_and_store_raws",
        Some(
            serde_json::to_string(&ParseAndStoreRaws {
                total_raws_parsed: total_raws,
                elapsed_time: format!("{duration2_test:?}"),
                parsed_raw_types: json!(options.raws_to_parse).to_string(),
                parsed_raw_locations: json!(options.locations_to_parse).to_string(),
            })
            .unwrap_or_default()
            .into(),
        ),
    );

    // Update the search lookup table
    update_search_lookup(&storage);
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
