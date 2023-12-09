use tauri::State;

use crate::state::GraphicStorage;

use super::{options::GraphicsOptions, results::GraphicsResults};

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Get the graphics for the given identifier.
///
/// This will return the graphic and all tile pages that are referenced by the graphic.
///
/// If the identifier is not found, an empty result will be returned.
///
/// # Arguments
///
/// * `options` - The options for the search.
///
/// # Returns
///
/// The results of the search.
pub async fn get_graphics_for_identifier(
    options: GraphicsOptions,
    state: State<'_, GraphicStorage>,
) -> Result<GraphicsResults, ()> {
    #[allow(clippy::unwrap_used)]
    if state.graphics_store.lock().unwrap().is_empty() {
        // If there isn't anything in the store, return an empty result.
        log::debug!(
            "get_graphics_for_identifier: No raws in storage, returning empty search results"
        );
        return Ok(GraphicsResults::default());
    }

    log::debug!(
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
    let Some(graphic_raws) = graphic_match else {
        log::warn!(
            "get_graphics_for_identifier: identifier not found: {}",
            options.identifier
        );
        return Ok(GraphicsResults::default());
    };

    let lookup_duration = start.elapsed();
    let start2 = std::time::Instant::now();

    let mut results = GraphicsResults {
        matching_graphics: Some(graphic_raws.clone()),
        ..GraphicsResults::default()
    };
    let tile_page_identifiers = graphic_raws
        .iter()
        .flat_map(dfraw_json_parser::graphics::Graphic::get_tile_pages)
        .collect::<Vec<_>>();

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

    log::debug!(
        "get_graphics_for_identifier: Found {} tile pages for identifier {}\nGraphic lookup: {}, Find tile pages: {}, Total: {}",
        tile_page_identifiers.len(),
        options.identifier,
        format!("{:?}", lookup_duration),
        format!("{:?}", tile_page_find_duration),
        format!("{:?}", total_duration),
    );

    Ok(results)
}
