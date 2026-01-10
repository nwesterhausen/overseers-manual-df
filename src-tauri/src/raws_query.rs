use std::num::ParseIntError;

use dfraw_parser::traits::RawObject;
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn get_raw_by_id(
    state: State<'_, AppState>,
    id: String,
) -> Result<Box<dyn RawObject>, String> {
    tracing::info!("get_raw_by_id:{id}");
    let raw_id: i64 = id.parse().map_err(|e: ParseIntError| {
        tracing::error!("{e}");
        e.to_string()
    })?;
    let db_client = state.db.lock().await;
    let raw = db_client.get_raw(raw_id).map_err(|e| {
        tracing::error!("{e}");
        e.to_string()
    })?;

    Ok(raw)
}
