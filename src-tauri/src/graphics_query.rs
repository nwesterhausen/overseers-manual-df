use tauri::State;

use crate::{AppState, GraphicsResults};

#[tauri::command]
pub async fn get_graphics(
    state: State<'_, AppState>,
    identifier: String,
) -> Result<GraphicsResults, String> {
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

    Ok(GraphicsResults {
        matching_graphics,
        tile_pages,
    })
}
