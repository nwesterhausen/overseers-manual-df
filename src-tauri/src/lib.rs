use dfraw_parser_sqlite_lib::{ClientOptions, DbClient};
use std::sync::OnceLock;
use tauri::{async_runtime::Mutex, path::BaseDirectory, AppHandle, Manager};
use tracing::level_filters::LevelFilter;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::{filter::Targets, prelude::*};

use graphics_query::*;
use log_event::*;
use parse_command::*;
use raws_query::*;
use search_query::*;
use shared_structs::*;
use utility::*;

mod graphics_query;
mod log_event;
mod parse_command;
mod raws_query;
mod search_query;
mod shared_structs;
mod utility;

struct AppState {
    db: Mutex<DbClient>,
}

static APP_IDENTIFIER: &str = "one.nwest.overseers-reference";
static LOG_GUARDS: OnceLock<(WorkerGuard, WorkerGuard)> = OnceLock::new();

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
        .invoke_handler(tauri::generate_handler![
            search_raws,
            parse_raws,
            get_raw_by_id,
            get_graphics
        ])
        .setup(|app| {
            register_tracing_subscribers(app.handle());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn register_tracing_subscribers(handle: &AppHandle) {
    // Resolve the logs directory
    let log_dir = handle
        .path()
        .resolve(format!("{}/logs", APP_IDENTIFIER), BaseDirectory::Data)
        .expect("Failed to resolve log directory");

    // Ensure the directory exists before rotating
    std::fs::create_dir_all(&log_dir).ok();

    // Perform versioned rotation before starting the logger
    rotate_logs(&log_dir, "app.log", 5); // Keep up to 5 old versions

    // Setup File Rotation (Daily: YYYY-MM-DD.log)
    // Note: rolling::daily adds the date suffix automatically
    let file_appender = tracing_appender::rolling::never(&log_dir, "app.log");
    let (file_writer, file_guard) = tracing_appender::non_blocking(file_appender);

    // Setup Terminal Output
    let (stdout_writer, stdout_guard) = tracing_appender::non_blocking(std::io::stdout());

    // Store guards so they aren't dropped when setup() ends
    LOG_GUARDS.set((file_guard, stdout_guard)).ok();

    // Filters for parsing event emitter
    let tauri_parsing_filter = Targets::new()
        .with_target("dfraw_parser::parser", LevelFilter::INFO)
        .with_target(
            "dfraw_parser_sqlite_lib::db::queries::insert_parse_results",
            LevelFilter::INFO,
        )
        .with_target(
            "dfraw_parser_sqlite_lib::db::queries::insert_modules",
            LevelFilter::INFO,
        )
        .with_default(LevelFilter::OFF);

    // Build Registry
    tracing_subscriber::registry()
        // Layer: Console (everything INFO+)
        .with(
            tracing_subscriber::fmt::layer()
                .with_writer(stdout_writer)
                .with_filter(LevelFilter::INFO),
        )
        // Layer: File (everything INFO+, no ANSI colors)
        .with(
            tracing_subscriber::fmt::layer()
                .with_writer(file_writer)
                .with_ansi(false)
                .with_filter(LevelFilter::INFO),
        )
        // Layer: parsing event emitter
        .with(
            TauriTracingLayer {
                app_handle: handle.clone(),
            }
            .with_filter(tauri_parsing_filter),
        )
        .init();
}
