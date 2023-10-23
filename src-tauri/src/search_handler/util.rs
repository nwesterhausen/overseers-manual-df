use dfraw_json_parser::parser::{
    creature::raw::Creature, helpers::clone_raw_object_box, inorganic::raw::Inorganic,
    object_types::ObjectType, plant::raw::Plant, searchable::get_search_string,
};
use tauri::State;

use crate::state::Storage;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_search_string_for_object(object_id: &str, storage: State<Storage>) -> String {
    // Get the matching raw object from the storage
    #[allow(clippy::unwrap_used)]
    let Some(raw) = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .find(|raw| raw.get_object_id() == object_id)
        .map(clone_raw_object_box::clone_raw_object_box)
    else {
        return String::new();
    };

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

    search_string
}
