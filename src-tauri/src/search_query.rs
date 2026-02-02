use dfraw_parser::traits::RawObject;
use dfraw_parser_sqlite_lib::{SearchQuery, SearchResults};
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn search_raws(
    state: State<'_, AppState>,
    query: SearchQuery,
) -> Result<SearchResults<Box<dyn RawObject>>, String> {
    tracing::info!("search_raws::query:{query:?}");
    let db_client = state.db.lock().await;
    let results = db_client.search_raws(&query.clean()).map_err(|e| {
        tracing::error!("{e}");
        e.to_string()
    })?;

    tracing::info!("search_raws::result_count:{}", results.results.len());
    Ok(results)
}
