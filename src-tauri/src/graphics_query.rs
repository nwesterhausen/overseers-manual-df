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
fn calculate_position_offset(
    offset: Dimensions,
    offset_2: Option<Dimensions>,
    page_dimensions: Dimensions,
    tile_dimensions: Dimensions,
) -> Dimensions {
    let offset_x = if let Some(offset_2) = offset_2 {
        if offset_2.x > offset.x {
            offset_2.x
        } else {
            offset.x
        }
    } else {
        offset.x
    };
    let pos_offset_x = page_dimensions.x - (offset.x + 1) * tile_dimensions.x
        + tile_dimensions.x * (offset_x - offset.x + 1);

    let offset_y = if let Some(offset_2) = offset_2 {
        if offset_2.y > offset.y {
            offset_2.y
        } else {
            offset.y
        }
    } else {
        offset.y
    };
    let pos_offset_y = page_dimensions.y - (offset.y + 1) * tile_dimensions.y
        + tile_dimensions.y * (offset_y - offset.y + 1);

    Dimensions {
        x: pos_offset_x,
        y: pos_offset_y,
    }
}
