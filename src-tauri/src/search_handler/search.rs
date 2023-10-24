use dfraw_json_parser::parser::{
    creature::raw::Creature,
    helpers::{clone_raw_object_box, clone_raw_vector},
    object_types::ObjectType,
    raws::RawObject,
};
use tauri::State;

use crate::state::Storage;

use super::{options::SearchOptions, results::SearchResults};

#[tauri::command]
#[allow(clippy::needless_pass_by_value, clippy::module_name_repetitions)]
pub fn search_raws(search_options: SearchOptions, storage: State<Storage>) -> SearchResults {
    #[allow(clippy::unwrap_used)]
    if storage.store.lock().unwrap().is_empty() {
        log::debug!("search_raws: No raws in storage, returning empty search results");
        return SearchResults::default();
    }
    log::info!(
        "search_raws: Processing search with options:\n{:#?}",
        search_options
    );

    // Utilize the search_lookup table to find raws with matching indexes.
    // First we can compare the search query to the search lookup table to get a list of indexes.
    // Then we can use those indexes to get the raws from the storage.
    // Then we can filter the raws by the search options (ObjectType, limit, page_num)

    // If the search query is empty, we should be returning all raws
    if search_options.query.is_empty() {
        let start = std::time::Instant::now();
        log::debug!("search_raws: Search query is empty, returning all raws");
        #[allow(clippy::unwrap_used)]
        let mut all_raws: Vec<Box<dyn RawObject>> = storage
            .store
            .lock()
            .unwrap()
            .iter()
            .filter(|raw| {
                // Filter by location
                search_options
                    .locations
                    .iter()
                    .any(|location| raw.get_metadata().get_location() == location)
                // Filter by object type
                && search_options
                    .object_types
                    .iter()
                    .any(|object_type| raw.get_type() == object_type)
                // Filter by egg layers (if `only_egg_layers` is true)
                && if search_options.only_egg_layers {
                    if raw.get_type() == &ObjectType::Creature {
                        let creature = raw.as_any().downcast_ref::<Creature>().unwrap();
                        let mut egg_layer = false;
                        for caste in creature.get_castes() {
                            if caste.is_egg_layer() {
                                egg_layer = true;
                                break;
                            }
                        }
                        egg_layer
                    } else {
                        true
                    }
                } else {
                    true
                    // Filter by does_not_exist
                } && if search_options.show_does_not_exist {
                        true
                    } else {
                        // Filter by does_not_exist (if `show_does_not_exist` is false)
                        if raw.get_type() == &ObjectType::Creature {
                            let creature = raw.as_any().downcast_ref::<Creature>().unwrap();
                            !creature.does_not_exist()
                        } else {
                            true
                        }
                    }
            })
            .map(clone_raw_object_box::clone_raw_object_box)
            .collect();

        all_raws.sort_by(|a, b| {
            a.get_name()
                .to_lowercase()
                .cmp(&b.get_name().to_lowercase())
        });

        let limited_raws: Vec<Box<dyn RawObject>> = clone_raw_vector::with_limit_and_page(
            &all_raws,
            search_options.limit,
            search_options.page,
        );
        let duration = start.elapsed();

        log::info!(
            "search_raws: search returned {} results ({} pages) in {}. Returning Page#{} with {} results",
            all_raws.len(),
            get_total_pages(all_raws.len(), search_options.limit),
            format!("{duration:?}"),
            search_options.page,
            limited_raws.len()
        );

        return SearchResults {
            results: limited_raws,
            total_results: all_raws.len(),
            #[allow(clippy::unwrap_used)]
            total_pages: get_total_pages(all_raws.len(), search_options.limit),
        };
    }
    let start = std::time::Instant::now();
    // Retrieve the indexes from the search lookup table
    // Filter the indexes by the search query
    #[allow(clippy::unwrap_used)]
    let filtered_indexes = storage
        .search_lookup
        .lock()
        .unwrap()
        .iter()
        .filter_map(|(search_string, index)| {
            // Filter by query
            if search_string
                .to_lowercase()
                .contains(&search_options.query.to_lowercase())
            {
                return Some(*index);
            }
            None
        })
        .collect::<Vec<usize>>();

    let search_duration = start.elapsed();
    let start2 = std::time::Instant::now();

    // Retrieve the raws with matching indexes from the storage
    // Filter the raws by the search options
    #[allow(clippy::unwrap_used)]
    let mut filtered_raws: Vec<_> = storage
        .store
        .lock()
        .unwrap()
        .iter()
        .enumerate()
        .filter_map(|(index, raw)| {
            if
            // Filter by index
            filtered_indexes.contains(&index)
            // Filter by location
            && search_options
                .locations
                .iter()
                .any(|location| raw.get_metadata().get_location() == location)
            // Filter by object type
            && search_options
                .object_types
                .iter()
                .any(|object_type| raw.get_type() == object_type)
            {
                if raw.get_type() == &ObjectType::Creature {
                    let creature = raw.as_any().downcast_ref::<Creature>().unwrap();
                    // Check for egg layers if `only_egg_layers` is true
                    if search_options.only_egg_layers {
                        let mut egg_layer = false;
                        for caste in creature.get_castes() {
                            if caste.is_egg_layer() {
                                egg_layer = true;
                                break;
                            }
                        }
                        if !egg_layer {
                            return None;
                        }
                    }
                    // Check for does_not_exist if `show_does_not_exist` is false
                    if !search_options.show_does_not_exist && creature.does_not_exist() {
                        return None;
                    }
                }
                return Some(raw);
            }
            None
        })
        .map(clone_raw_object_box::clone_raw_object_box)
        .collect();

    let filter_duration = start2.elapsed();
    let start2 = std::time::Instant::now();

    // Sort the filtered raws by raw name
    filtered_raws.sort_by(|a, b| {
        // If they have a name, use a name, otherwise use their identifier.
        let a_cmp_string = if a.get_name().is_empty() {
            a.get_identifier().to_lowercase()
        } else {
            a.get_name().to_lowercase()
        };
        let b_cmp_string = if b.get_name().is_empty() {
            b.get_identifier().to_lowercase()
        } else {
            b.get_name().to_lowercase()
        };

        a_cmp_string.cmp(&b_cmp_string)
    });

    let sort_duration = start2.elapsed();

    // Further refine the filtered raws by the search options (limit & page_num)
    // Return a clone of the raw vector with limits applied
    let limited_raws = clone_raw_vector::with_limit_and_page(
        &filtered_raws,
        search_options.limit,
        search_options.page,
    );

    let total_pages = get_total_pages(limited_raws.len(), search_options.limit);
    let duration = start.elapsed();

    log::info!(
        "search_raws: search returned {} results ({} pages) in {}. Returning Page#{} with {} results\nsearch: {}, filter/clone: {}, sort: {}",
        filtered_raws.len(),
        get_total_pages(filtered_raws.len(), search_options.limit),
        format!("{duration:?}"),
        search_options.page,
        limited_raws.len(),
        format!("{search_duration:?}"),
        format!("{filter_duration:?}"),
        format!("{sort_duration:?}"),
    );
    SearchResults {
        // Return the limited raws
        results: limited_raws,
        // Return the total number of results
        total_results: filtered_raws.len(),
        // Return the total number of pages
        total_pages,
    }
}

#[allow(
    clippy::cast_possible_truncation,
    clippy::cast_sign_loss,
    clippy::cast_precision_loss
)]
fn get_total_pages(total_results: usize, limit: usize) -> usize {
    let f_total = total_results as f64;
    let f_limit = limit as f64;

    let total_pages = f_total / f_limit;

    if total_pages.fract() > 0.0 {
        total_pages as usize + 1
    } else {
        total_pages as usize
    }
}
