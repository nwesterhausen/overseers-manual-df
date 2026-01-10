use dfraw_parser_sqlite_lib::{ClientOptions, DbClient};
use tauri::async_runtime::Mutex;
use tauri_plugin_log::{Target, TargetKind, WEBVIEW_TARGET};

use graphics_query::*;
use parse_command::*;
use raws_query::*;
use search_query::*;
use shared_structs::*;

mod graphics_query;
mod parse_command;
mod raws_query;
mod search_query;
mod shared_structs;

struct AppState {
    db: Mutex<DbClient>,
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
        .invoke_handler(tauri::generate_handler![
            search_raws,
            parse_raws,
            get_raw_by_id,
            get_graphics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
