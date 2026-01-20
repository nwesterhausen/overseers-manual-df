use dfraw_parser::metadata::ParserOptions;
use tauri::State;

use crate::{format_time_delta, AppState};

/// Get the last used game directory
#[tauri::command]
pub async fn retrieve_last_dwarf_fortress_directory(
    state: State<'_, AppState>,
) -> Result<String, String> {
    tracing::info!("retrieve_last_dwarf_fortress_directory");
    let db_client = state.db.lock().await;
    let df_path = db_client.get_last_used_df_game_dir().map_err(|e| {
        tracing::error!("retrieve_dwarf_fortress_directory: {e}");
        e.to_string()
    });
    df_path
}

/// Get the last used user data directory
#[tauri::command]
pub async fn retrieve_last_user_data_directory(
    state: State<'_, AppState>,
) -> Result<String, String> {
    tracing::info!("retrieve_last_user_data_directory");
    let db_client = state.db.lock().await;
    let user_data_path = db_client.get_last_used_df_user_dir().map_err(|e| {
        tracing::error!("retrieve_user_data_directory: {e}");
        e.to_string()
    });
    user_data_path
}

/// Get the last used parser options
#[tauri::command]
pub async fn retrieve_last_parser_options(
    state: State<'_, AppState>,
) -> Result<ParserOptions, String> {
    tracing::info!("retrieve_last_parser_options");
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

/// Get the last parse duration as a `chrono::TimeDelta`
#[tauri::command]
pub async fn retrieve_last_parse_duration(state: State<'_, AppState>) -> Result<String, String> {
    tracing::info!("retrieve_last_parse_duration");
    let db_client = state.db.lock().await;
    db_client
        .get_last_parse_duration()
        .map_err(|e| {
            tracing::error!("retrieve_last_parse_duration: {e}");
            e.to_string()
        })
        .and_then(|opt| opt.ok_or("No result".to_string()))
        .map(format_time_delta)
}

/// Get the last raw files insertion duration as a `chrono::TimeDelta`
#[tauri::command]
pub async fn retrieve_last_insertion_duration(
    state: State<'_, AppState>,
) -> Result<String, String> {
    tracing::info!("retrieve_last_insertion_duration");
    let db_client = state.db.lock().await;
    db_client
        .get_last_insertion_duration()
        .map_err(|e| {
            tracing::error!("retrieve_last_insertion_duration: {e}");
            e.to_string()
        })
        .and_then(|opt| opt.ok_or("No result".to_string()))
        .map(format_time_delta)
}

/// Get up to the last 10 recent search terms
#[tauri::command]
pub async fn retrieve_recent_search_terms(
    state: State<'_, AppState>,
) -> Result<Vec<String>, String> {
    tracing::info!("retrieve_recent_search_terms");
    let db_client = state.db.lock().await;
    let terms = db_client.get_recent_search_terms().map_err(|e| {
        tracing::error!("retrieve_recent_search_terms: {e}");
        e.to_string()
    });
    terms
}

/// Retrieve the list of favorited raws
#[tauri::command]
pub async fn retrieve_favorite_raws(state: State<'_, AppState>) -> Result<Vec<i64>, String> {
    tracing::info!("retrieve_favorite_raws");
    let db_client = state.db.lock().await;
    let favorites = db_client.get_favorite_raws().map_err(|e| {
        tracing::error!("retrieve_favorite_raws: {e}");
        e.to_string()
    });
    favorites
}

/// Add a favorite raw
#[tauri::command]
pub async fn add_favorite_raw(state: State<'_, AppState>, raw_id: i64) -> Result<String, String> {
    tracing::info!("add_favorite_raw::{raw_id}");
    let db_client = state.db.lock().await;
    match db_client.add_favorite_raw(raw_id) {
        Ok(()) => Ok(String::from("Favorite added.")),
        Err(e) => {
            tracing::error!("add_favorite_raw({raw_id}): {e}");
            Err(e.to_string())
        }
    }
}

/// Remove a favorite raw
#[tauri::command]
pub async fn remove_favorite_raw(
    state: State<'_, AppState>,
    raw_id: i64,
) -> Result<String, String> {
    tracing::info!("remove_favorite_raw::{raw_id}");
    let db_client = state.db.lock().await;
    match db_client.remove_favorite_raw(raw_id) {
        Ok(()) => Ok(String::from("Favorite removed.")),
        Err(e) => {
            tracing::error!("remove_favorite_raw({raw_id}): {e}");
            Err(e.to_string())
        }
    }
}

/// Set the preferred page-limit
#[tauri::command]
pub async fn persist_preferred_search_limit(
    state: State<'_, AppState>,
    limit: u32,
) -> Result<u32, String> {
    tracing::info!("persist_preferred_search_limit::{limit}");
    let db_client = state.db.lock().await;
    match db_client.set_preferred_search_limit(limit) {
        Ok(()) => Ok(limit),
        Err(e) => {
            tracing::error!("persist_preferred_search_limit({limit}): {e}");
            Err(e.to_string())
        }
    }
}

/// Get the preferred page limit
#[tauri::command]
pub async fn retrieve_preferred_search_limit(state: State<'_, AppState>) -> Result<u32, String> {
    tracing::info!("retrieve_preferred_search_limit");
    let db_client = state.db.lock().await;
    db_client.get_preferred_search_limit().map_err(|e| {
        tracing::error!("retrieve_preferred_search_limit: {e}");
        e.to_string()
    })
}

/// Get the time the last insertion was done
#[tauri::command]
pub async fn retrieve_last_insertion_date(state: State<'_, AppState>) -> Result<String, String> {
    tracing::info!("retrieve_last_insertion_date");
    let db_client = state.db.lock().await;
    let date = db_client
        .get_last_insertion_date()
        .map_err(|e| {
            tracing::error!("retrieve_last_insertion_date: {e}");
            e.to_string()
        })
        .and_then(|opt| opt.ok_or("No result".to_string()));
    date
}

/// Get the time the last parse was done
#[tauri::command]
pub async fn retrieve_last_parse_operation_date(
    state: State<'_, AppState>,
) -> Result<String, String> {
    tracing::info!("retrieve_last_parse_operation_date");
    let db_client = state.db.lock().await;
    let date = db_client
        .get_last_parse_operation_date()
        .map_err(|e| {
            tracing::error!("retrieve_last_parse_operation_date: {e}");
            e.to_string()
        })
        .and_then(|opt| opt.ok_or("No result".to_string()));
    date
}
