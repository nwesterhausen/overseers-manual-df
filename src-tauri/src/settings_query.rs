use tauri::State;

use crate::{shared_structs::StoredSettings, AppState};

#[tauri::command]
pub async fn retrieve_stored_settings(
    state: State<'_, AppState>,
) -> Result<StoredSettings, String> {
    let db_client = state.db.lock().await;
    db_client
        .get_stored_settings()
        .map_err(|e| {
            tracing::error!("retrieve_stored_settings: {e}");
            e.to_string()
        })
        .and_then(|settings_string| {
            serde_json::from_str::<StoredSettings>(&settings_string).map_err(|e| {
                tracing::error!("retrieve_stored_settings: {e}");
                e.to_string()
            })
        })
}

#[tauri::command]
pub async fn persist_stored_settings(
    state: State<'_, AppState>,
    settings: StoredSettings,
) -> Result<(), String> {
    let json_string = serde_json::to_string(&settings).map_err(|e| {
        tracing::error!("persist_stored_settings: {e}");
        e.to_string()
    })?;

    let db_client = state.db.lock().await;
    db_client.set_stored_settings(&json_string).map_err(|e| {
        tracing::error!("persist_stored_settings: {e}");
        e.to_string()
    })
}
