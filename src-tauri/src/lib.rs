use std::path::PathBuf;

use dfraw_parser::{metadata::ParserOptions, traits::RawObject};
use dfraw_parser_sqlite_lib::{ClientOptions, DbClient, SearchQuery};
use tauri::{async_runtime::Mutex, State};

struct AppState {
    // We use Mutex because insert_module_data requires &mut self
    db: Mutex<DbClient>,
}

#[tauri::command]
async fn search_raws(
    state: State<'_, AppState>,
    query: SearchQuery,
) -> Result<Vec<Box<dyn RawObject>>, String> {
    let db_client = state.db.lock().await;
    let blobs = db_client.search_raws(&query).map_err(|e| e.to_string())?;

    let results = blobs
        .into_iter()
        // Deserialize the JSON blob back into a Boxed trait object
        // typetag handles figuring out if it's a Creature, Plant, etc.
        .filter_map(|blob| {
            serde_json::from_slice::<Box<dyn dfraw_parser::traits::RawObject>>(&blob).ok()
        })
        .collect();

    Ok(results)
}

#[tauri::command]
async fn parse_raws(
    state: State<'_, AppState>,
    df_dir: Option<String>,
    user_dir: Option<String>,
    // Add other parser options as needed
) -> Result<String, String> {
    let mut db = state.db.lock().await;

    let mut options = ParserOptions::new();
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let options = ClientOptions::default();
    let db_client = DbClient::init_db("overseer.db", options).expect("failed to init db");

    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(db_client),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![search_raws, parse_raws])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
