use dfraw_parser::Dimensions;
use tauri::State;

use crate::{AppState, GraphicsResult};

#[tauri::command]
pub async fn get_graphics(
    state: State<'_, AppState>,
    identifier: String,
) -> Result<Vec<GraphicsResult>, String> {
    tracing::info!("get_graphics::identifier:{identifier:?}");
    let db_client = state.db.lock().await;

    let mut matching_graphics = db_client
        .get_sprite_graphics_for_target_identifier(&identifier)
        .map_err(|e| {
            tracing::error!("{e}");
            e.to_string()
        })?;
    let mut tile_pages = Vec::new();

    matching_graphics.retain(|graphic| {
        match db_client.get_tile_page_by_identifier(&graphic.tile_page_identifier) {
            Ok(tile_page_opt) => {
                if let Some(tile_page) = tile_page_opt {
                    tile_pages.push(tile_page);
                    true
                } else {
                    tracing::error!(
                        "Couldn't find target tile page: tile_page_identifier:{}",
                        graphic.tile_page_identifier
                    );
                    false
                }
            }
            Err(e) => {
                tracing::error!("{e}");
                false
            }
        }
    });

    let useful_results: Vec<GraphicsResult> = matching_graphics
        .iter()
        .filter_map(|graphic| {
            let target_tile_page = tile_pages
                .iter()
                .find(|t| t.identifier == graphic.tile_page_identifier);

            target_tile_page.map(|tp| {
                let tile_dimensions = Dimensions {
                    x: tp.tile_width,
                    y: tp.tile_height,
                };

                let page_dimensions = Dimensions {
                    x: tp.page_width,
                    y: tp.page_height,
                };

                let offset = Dimensions {
                    x: u32::try_from(graphic.offset_x).unwrap_or(0),
                    y: u32::try_from(graphic.offset_y).unwrap_or(0),
                };

                let offset_2 = if graphic.offset_x_2.is_none() {
                    None
                } else {
                    Some(Dimensions {
                        x: u32::try_from(graphic.offset_x_2.unwrap_or_default()).unwrap_or(0),
                        y: u32::try_from(graphic.offset_y_2.unwrap_or_default()).unwrap_or(0),
                    })
                };

                GraphicsResult {
                    position_offset: calculate_position_offset(
                        offset,
                        offset_2,
                        page_dimensions,
                        tile_dimensions,
                    ),
                    file_path: tp.file_path.clone(),
                    tile_dimensions,
                    page_dimensions,
                    description: format!(
                        "{}:{}",
                        graphic.primary_condition, graphic.secondary_condition
                    ),
                    offset,
                    offset_2,
                }
            })
        })
        .collect();

    Ok(useful_results)
}

/// Calculates the position offset used when drawing a sprite off the tile sheet. This is used
/// on the frontend to display the sprite to the end user.
///
/// Essentially this is figuring out on the page where to start drawing the sprite in px.
/// It's up to the consumer of `GraphicsResult` to also use the tile dimensions to create the
/// final bounding box.
fn calculate_position_offset(
    offset: Dimensions,
    offset_2: Option<Dimensions>,
    page_dimensions: Dimensions,
    tile_dimensions: Dimensions,
) -> Dimensions {
    // Determine the boundary: use offset_2 if it's larger, otherwise stick with offset.
    let max_off = offset_2
        .map(|o2| o2.max_components(offset))
        .unwrap_or(offset);

    // Helper to perform the specific coordinate math
    let compute = |off: u32, max: u32, page_dim: u32, tile_dim: u32| -> u32 {
        let anchor = page_dim.saturating_sub(off * tile_dim);
        let extra_span = (max - off) * tile_dim;

        anchor + extra_span
    };

    Dimensions {
        x: compute(offset.x, max_off.x, page_dimensions.x, tile_dimensions.x),
        y: compute(offset.y, max_off.y, page_dimensions.y, tile_dimensions.y),
    }
}
