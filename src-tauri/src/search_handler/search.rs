use dfraw_json_parser::parser::{helpers::clone_raw_vector, raws::RawObject};
use tauri::State;

use super::{options::SearchOptions, prepare::Storage, results::SearchResults};

#[tauri::command]
#[allow(clippy::needless_pass_by_value, clippy::module_name_repetitions)]
pub fn search_raws(search_options: SearchOptions, storage: State<Storage>) -> SearchResults {
    #[allow(clippy::unwrap_used)]
    if storage.store.lock().unwrap().is_empty() {
        log::warn!("No raws in storage, returning empty search results");
        return SearchResults::default();
    }
    log::info!("Processing search with options: {:#?}", search_options);

    // Utilize the search_lookup table to find raws with matching indexes.
    // First we can compare the search query to the search lookup table to get a list of indexes.
    // Then we can use those indexes to get the raws from the storage.
    // Then we can filter the raws by the search options (ObjectType, limit, page_num)

    // If the search query is empty, we should be returning all raws
    if search_options.query.is_empty() {
        log::info!("Search query is empty, returning all raws");
        #[allow(clippy::unwrap_used)]
        let mut all_raws: Vec<Box<dyn RawObject>> = storage
            .store
            .lock()
            .unwrap()
            .iter()
            .filter(|raw| {
                search_options
                    .object_types
                    .iter()
                    .any(|object_type| raw.get_type() == object_type)
            })
            .map(clone_raw_vector::clone_raw_object_box)
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

        return SearchResults {
            results: limited_raws,
            total_results: all_raws.len(),
            #[allow(clippy::unwrap_used)]
            total_pages: get_total_pages(all_raws.len(), search_options.limit),
        };
    }

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
            // Filter by object type
            && search_options
                .object_types
                .iter()
                .any(|object_type| raw.get_type() == object_type)
            {
                return Some(raw);
            }
            None
        })
        .map(clone_raw_vector::clone_raw_object_box)
        .collect();

    // Sort the filtered raws by raw name
    filtered_raws.sort_by(|a, b| {
        a.get_name()
            .to_lowercase()
            .cmp(&b.get_name().to_lowercase())
    });

    // Further refine the filtered raws by the search options (limit & page_num)
    // Return a clone of the raw vector with limits applied
    let limited_raws = clone_raw_vector::with_limit_and_page(
        &filtered_raws,
        search_options.limit,
        search_options.page,
    );

    let total_pages = get_total_pages(limited_raws.len(), search_options.limit);

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
