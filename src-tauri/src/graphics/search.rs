use tauri::State;

use crate::state::Storage;

use super::{options::GraphicsOptions, results::GraphicsResults};

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_graphics_for_identifier(
    options: GraphicsOptions,
    state: State<Storage>,
) -> GraphicsResults {
    #[allow(clippy::unwrap_used)]
    if state.store.lock().unwrap().is_empty() {
        log::info!(
            "get_graphics_for_identifier: No raws in storage, returning empty search results"
        );
        return GraphicsResults::default();
    }
    log::info!(
        "get_graphics_for_identifier: Processing search with options:\n{:#?}",
        options
    );
    let start = std::time::Instant::now();
    #[allow(clippy::unwrap_used)]
    let graphic_match = state
        .graphics_store
        .lock()
        .unwrap()
        .get(options.identifier.as_str())
        .cloned();
    let Some(graphic_raw) = graphic_match else {
        log::warn!(
            "get_graphics_for_identifier: identifier not found: {}",
            options.identifier
        );
        return GraphicsResults::default();
    };

    let lookup_duration = start.elapsed();
    let start2 = std::time::Instant::now();

    let mut results = GraphicsResults {
        graphic: Some(graphic_raw.clone()),
        ..GraphicsResults::default()
    };
    let tile_page_identifiers = graphic_raw.get_tile_pages();

    // Find the tile pages with the given identifiers
    #[allow(clippy::unwrap_used)]
    let tile_page_store = state.tile_page_store.lock().unwrap();
    for tile_page_identifier in &tile_page_identifiers {
        if let Some(tile_page) = tile_page_store.get(tile_page_identifier) {
            results.tile_pages.push(tile_page.clone());
        } else {
            log::warn!(
                "get_graphics_for_identifier: tile page identifier not found: {}",
                tile_page_identifier
            );
        }
    }
    let tile_page_find_duration = start2.elapsed();
    let total_duration = start.elapsed();

    log::info!(
        "get_graphics_for_identifier: Found {} tile pages for identifier {}\nGraphic lookup: {}, Find tile pages: {}, Total: {}",
        tile_page_identifiers.len(),
        options.identifier,
        format!("{:?}", lookup_duration),
        format!("{:?}", tile_page_find_duration),
        format!("{:?}", total_duration),
    );

    results
}
