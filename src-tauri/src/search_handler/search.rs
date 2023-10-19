
use dfraw_json_parser::parser::helpers::clone_raw_vector;
use tauri::State;

use super::{options::SearchOptions, prepare::Storage, results::SearchResults};

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn search_raws(search_options: SearchOptions, storage: State<Storage>) -> SearchResults {
    if storage.store.lock().unwrap().is_empty() {
        log::error!("No raws in storage, returning empty search results");
        return SearchResults::default();
    }
    log::error!("Processing search with options: {:#?}", search_options);
    // Retrieve the raws from the storage
    // Filter the raws by the search options
    let filtered_raws: Vec<_> = storage.store.lock().unwrap()
        .iter()
        .filter(|raw| {
            // Filter by object type
            search_options
                .object_types
                .iter()
                .any(|object_type| raw.get_type() == object_type)
                // Filter by query
                && 
                raw.get_identifier()
                    .to_lowercase()
                    .contains(&search_options.query.to_lowercase())
        })
        .map(clone_raw_vector::clone_raw_object_box)
        .collect();

    let limited_raws = 
    // Return a clone of the raw vector, limited by the search options (limit & page_num)
    clone_raw_vector::with_limit_and_page(
        &filtered_raws,
        search_options.limit,
        search_options.page,
    );

let total_pages = get_total_pages(limited_raws.len(),search_options.limit);

SearchResults {
    // Return the limited raws
    results: limited_raws,
    // Return the total number of results
    total_results: filtered_raws.len(),
    // Return the total number of pages
    total_pages,
}
}

#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
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