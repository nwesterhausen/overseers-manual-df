use dfraw_parser::traits::RawObject;
use dfraw_parser_sqlite_lib::{ResultWithId, SearchQuery, SearchResults};
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn search_raws(
    state: State<'_, AppState>,
    query: SearchQuery,
) -> Result<SearchResults<Box<dyn RawObject>>, String> {
    tracing::info!("search_raws::query:{query:?}");
    let db_client = state.db.lock().await;
    let search_results = db_client.search_raws(&query.clean()).map_err(|e| {
        tracing::error!("{e}");
        e.to_string()
    })?;

    let results: Vec<ResultWithId<Box<dyn RawObject>>> = search_results
        .results
        .into_iter()
        // Deserialize the JSON blob back into a Boxed trait object
        // typetag handles figuring out if it's a Creature, Plant, etc.
        .filter_map(|blob| {
            match serde_json::from_slice::<Box<dyn RawObject>>(&blob.data) {
                Ok(obj) => Some(ResultWithId {
                    id: blob.id,
                    data: obj,
                }),
                Err(e) => {
                    // This will tell you EXACTLY why it's failing (e.g., "expected value at line 1")
                    tracing::error!("Failed to deserialize raw object: {e}");
                    None
                }
            }
        })
        .collect();

    let count = results.len();
    tracing::info!("search_raws::result_count:{count}");
    Ok(SearchResults {
        results,
        total_count: search_results.total_count,
    })
}
