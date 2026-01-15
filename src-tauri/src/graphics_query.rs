use dfraw_parser::Dimensions;
use dfraw_parser_sqlite_lib::SpriteGraphicData;
use tauri::State;

use crate::{AppState, GraphicsResult};

#[tauri::command]
pub async fn get_graphics(
    state: State<'_, AppState>,
    identifier: String,
    viewport: Option<Dimensions>,
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

                let offset_2 = graphic
                    .offset_x_2
                    .zip(graphic.offset_y_2)
                    .and_then(|(x, y)| {
                        // Use and_then if the conversion itself could return None/Result
                        let x_u32 = u32::try_from(x).ok()?;
                        let y_u32 = u32::try_from(y).ok()?;

                        Some(Dimensions { x: x_u32, y: y_u32 })
                    });

                // Calculate the span of the sprite in tiles
                let sprite_width_tiles = (graphic.offset_x_2.unwrap_or(graphic.offset_x)
                    - graphic.offset_x)
                    .unsigned_abs() as u32
                    + 1;

                let sprite_height_tiles = (graphic.offset_y_2.unwrap_or(graphic.offset_y)
                    - graphic.offset_y)
                    .unsigned_abs() as u32
                    + 1;

                // Calculate total pixel size of this specific sprite
                let total_sprite_px_w = sprite_width_tiles * tile_dimensions.x;
                let total_sprite_px_h = sprite_height_tiles * tile_dimensions.y;

                // Calculate final CSS values based on viewport
                let (bg_size, bg_position) = if let Some(vp) = viewport {
                    // Scale based on the LARGEST pixel dimension of the sprite
                    let max_sprite_px = total_sprite_px_w.max(total_sprite_px_h) as f32;
                    let scale = vp.x as f32 / max_sprite_px;

                    (
                        format!(
                            "{}px {}px",
                            page_dimensions.x as f32 * scale,
                            page_dimensions.y as f32 * scale
                        ),
                        // Position must point to the top-left tile, scaled down
                        format!(
                            "-{}px -{}px",
                            (offset.x * tile_dimensions.x) as f32 * scale,
                            (offset.y * tile_dimensions.y) as f32 * scale
                        ),
                    )
                } else {
                    (
                        format!("{}px {}px", page_dimensions.x, page_dimensions.y),
                        format!(
                            "-{}px -{}px",
                            offset.x * tile_dimensions.x,
                            offset.y * tile_dimensions.y
                        ),
                    )
                };

                GraphicsResult {
                    bg_size,
                    bg_position,
                    file_path: tp.file_path.clone(),
                    aspect_ratio: Dimensions {
                        x: sprite_width_tiles,
                        y: sprite_height_tiles,
                    },
                    description: calculate_description(graphic),
                    offset,
                    offset_2,
                    tile_dimensions,
                    page_dimensions,
                }
            })
        })
        .collect();

    Ok(useful_results)
}

/// Creates a description based on the condition values.
fn calculate_description(sprite: &SpriteGraphicData) -> String {
    if sprite.primary_condition == sprite.secondary_condition {
        if sprite.primary_condition.is_empty() {
            return "DEFAULT".to_string();
        }
        sprite.primary_condition.clone()
    } else {
        if sprite.secondary_condition.is_empty()
            || sprite.secondary_condition.eq(&"DEFAULT".to_string())
        {
            return sprite.primary_condition.to_string();
        }
        format!(
            "{} {}",
            sprite.primary_condition, sprite.secondary_condition
        )
    }
}
