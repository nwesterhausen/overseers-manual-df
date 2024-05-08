use dfraw_json_parser::{
    creature::Creature, get_search_string, helpers::clone_raw_object_box, inorganic::Inorganic,
    plant::Plant, ObjectType,
};
use tauri::State;

use crate::state::Storage;

/// Gets the search string for an object.
///
/// # Arguments
///
/// * `object_id` - The ID of the object to get the search string for.
/// * `storage` - (Passed transparently) The storage to get the object from.
///
/// # Returns
///
/// Returns the search string for the object.
///
/// # Errors
///
/// Returns an empty string if the object is not found.
///
/// # Panics
///
/// This function will panic if the storage mutex is poisoned.
#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub async fn get_search_string_for_object(
    object_id: String,
    storage: State<'_, Storage>,
) -> Result<String, ()> {
    // Get the matching raw object from the storage
    #[allow(clippy::unwrap_used)]
    let Some(raw) = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .find(|raw| raw.get_object_id() == object_id)
        .map(clone_raw_object_box)
    else {
        return Ok(String::new());
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

    Ok(search_string)
}
