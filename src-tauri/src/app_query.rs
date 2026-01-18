use dfraw_parser::metadata::ParserOptions;
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn retrieve_last_dwarf_fortress_directory(
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db_client = state.db.lock().await;
    let df_path = db_client.get_last_used_df_game_dir().map_err(|e| {
        tracing::error!("retrieve_dwarf_fortress_directory: {e}");
        e.to_string()
    });
    df_path
}

#[tauri::command]
pub async fn retrieve_last_user_data_directory(
    state: State<'_, AppState>,
) -> Result<String, String> {
    let db_client = state.db.lock().await;
    let user_data_path = db_client.get_last_used_df_user_dir().map_err(|e| {
        tracing::error!("retrieve_user_data_directory: {e}");
        e.to_string()
    });
    user_data_path
}

#[tauri::command]
pub async fn retrieve_last_parser_options(
    state: State<'_, AppState>,
) -> Result<ParserOptions, String> {
    let db_client = state.db.lock().await;
    let parser_options = db_client
        .get_last_used_parser_options()
        .map_err(|e| {
            tracing::error!("retrieve_parser_options: {e}");
            e.to_string()
        })
        .and_then(|opt| opt.ok_or("No result".to_string()));
    parser_options
}
