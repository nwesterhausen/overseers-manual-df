use std::path::PathBuf;

use dfraw_parser::metadata::{ParserOptions, RawModuleLocation};
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn parse_raws(
    state: State<'_, AppState>,
    df_dir: Option<String>,
    user_dir: Option<String>,
    // Add other parser options as needed
) -> Result<String, String> {
    tracing::info!("df_dir:{df_dir:?}, user_dir:{user_dir:?}");
    let mut db = state.db.lock().await;

    let mut options = ParserOptions::new();
    options.add_location_to_parse(RawModuleLocation::Vanilla);

    if let Some(dir) = df_dir {
        options.set_dwarf_fortress_directory(&PathBuf::from(dir));
    }
    if let Some(dir) = user_dir {
        options.set_user_data_directory(&PathBuf::from(dir));
    }
    let results = dfraw_parser::parse(&options).map_err(|e| e.to_string())?;

    db.insert_parse_results(results)
        .map_err(|e| e.to_string())?;

    Ok("Parsing and storage complete".to_string())
}
