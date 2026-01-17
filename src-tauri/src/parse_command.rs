use dfraw_parser::metadata::{LocationHelper, ParserOptions, RawModuleLocation};
use tauri::State;

use crate::{shared_structs::DbOptionOnParse, AppState};

#[tauri::command]
pub async fn parse_raws(
    state: State<'_, AppState>,
    directories: LocationHelper,
    locations: Vec<RawModuleLocation>,
    db_option: DbOptionOnParse,
    // Add other parser options as needed
) -> Result<String, String> {
    tracing::info!("parse_raws::locations:{locations:?} directories:{directories:?}");
    let mut db = state.db.lock().await;

    let mut options = ParserOptions::new();
    options.set_locations_to_parse(locations);

    if let Some(dir) = directories.get_df_directory() {
        options.set_dwarf_fortress_directory(&dir);
    }
    if let Some(dir) = directories.get_user_data_directory() {
        options.set_user_data_directory(&dir);
    }
    let results = dfraw_parser::parse(&options).map_err(|e| e.to_string())?;

    match db_option {
        DbOptionOnParse::InsertOnly => db
            .insert_parse_results(results)
            .map_err(|e| e.to_string())?,
        DbOptionOnParse::ForceUpdate => {
            // somhow specify to force update

            db.insert_parse_results(results)
                .map_err(|e| e.to_string())?;
        }
        DbOptionOnParse::Reset => {
            // call a db reset command

            db.insert_parse_results(results)
                .map_err(|e| e.to_string())?;
        }
    }

    Ok("Parsing and storage complete".to_string())
}
