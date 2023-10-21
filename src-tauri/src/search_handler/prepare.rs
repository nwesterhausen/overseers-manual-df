use dfraw_json_parser::{
    options::ParserOptions,
    parser::{
        creature::raw::Creature, helpers::clone_raw_object_box::clone_raw_object_box,
        inorganic::raw::Inorganic, object_types::ObjectType, plant::raw::Plant, raws::RawObject,
        searchable::get_search_string,
    },
};
use std::sync::Mutex;
use tauri::{State, Window};

pub struct Storage {
    pub store: Mutex<Vec<Box<dyn RawObject>>>,
    pub search_lookup: Mutex<Vec<(String, usize)>>,
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn parse_and_store_raws(options: ParserOptions, window: Window, storage: State<Storage>) {
    log::info!(
        "parse_and_store_raws: parsing raws with options\n{:#?}",
        options
    );
    // Get the raws with given options (and progress)
    let raws_vec = dfraw_json_parser::parse_with_tauri_emit(&options, window);
    // Store the raws in the storage, after clearing it
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().clear();
    #[allow(clippy::unwrap_used)]
    storage.store.lock().unwrap().extend(raws_vec);
    // Update the search lookup table
    update_search_lookup(&storage);
}

fn update_search_lookup(storage: &State<Storage>) {
    #[allow(clippy::unwrap_used)]
    let prev_length = storage.search_lookup.lock().unwrap().len();
    // Clear the search lookup table
    #[allow(clippy::unwrap_used)]
    storage.search_lookup.lock().unwrap().clear();
    // Get the raws from the storage
    #[allow(clippy::unwrap_used)]
    let raws = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .map(clone_raw_object_box)
        .collect::<Vec<Box<dyn RawObject>>>();
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

    #[allow(clippy::unwrap_used)]
    let current_length = storage.search_lookup.lock().unwrap().len();

    log::info!(
        "update_search_lookup: Search Tables Updates. Previous: {} entries Current: {} entries",
        prev_length,
        current_length,
    );
}
