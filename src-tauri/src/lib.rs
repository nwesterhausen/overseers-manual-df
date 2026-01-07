use std::path::PathBuf;

use dfraw_parser::{
    metadata::{ParserOptions, RawModuleLocation},
    traits::RawObject,
};
use dfraw_parser_sqlite_lib::{ClientOptions, DbClient, SearchQuery, SearchResults};
use tauri::{async_runtime::Mutex, State};
use tauri_plugin_log::{Target, TargetKind, WEBVIEW_TARGET};

struct AppState {
    // We use Mutex because insert_module_data requires &mut self
    db: Mutex<DbClient>,
}

#[tauri::command]
async fn search_raws(
    state: State<'_, AppState>,
    query: SearchQuery,
) -> Result<SearchResults<Box<dyn RawObject>>, String> {
    tracing::info!("search_raws::query:{query:?}");
    let db_client = state.db.lock().await;
    let search_results = db_client.search_raws(&query.clean()).map_err(|e| {
        tracing::error!("{e}");
        e.to_string()
    })?;

    let results: Vec<Box<dyn dfraw_parser::traits::RawObject>> = search_results
        .results
        .into_iter()
        // Deserialize the JSON blob back into a Boxed trait object
        // typetag handles figuring out if it's a Creature, Plant, etc.
        .filter_map(|blob| {
            match serde_json::from_slice::<Box<dyn dfraw_parser::traits::RawObject>>(&blob) {
                Ok(obj) => Some(obj),
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

#[tauri::command]
async fn parse_raws(
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let options = ClientOptions::default();
    let db_client = DbClient::init_db("overseer.db", options).expect("failed to init db");

    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(db_client),
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .clear_targets()
                .targets([
                    Target::new(TargetKind::Webview),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("webview.log".into()),
                    })
                    .filter(|metadata| metadata.target() == WEBVIEW_TARGET),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("rust.log".into()),
                    })
                    .filter(|metadata| metadata.target() != WEBVIEW_TARGET),
                    Target::new(TargetKind::Stdout),
                ])
                .format(move |out, message, record| {
                    out.finish(format_args!(
                        "{} [{}] {}",
                        chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                        record.level(),
                        message
                    ));
                })
                .level(log::LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![search_raws, parse_raws])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
