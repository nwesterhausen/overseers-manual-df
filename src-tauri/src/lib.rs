use std::sync::Mutex;

use tauri_plugin_aptabase::EventTracker;
use tauri_plugin_log::{Target, TargetKind, WEBVIEW_TARGET};

use dotenvy_macro::dotenv;

mod parsing;
mod search_handler;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
/// This function sets up and runs a Rust application using the Tauri framework, with various plugins
/// and event handlers.
/// # Panics
/// This function will panic if the Tauri app fails to build or run.
pub fn run() {
    #[allow(clippy::expect_used)]
    tauri::Builder::default()
        // Set up shared state
        .manage(search_handler::prepare::Storage {
            store: Mutex::default(),
        })
        // Add logging plugin
        .plugin(
            tauri_plugin_log::Builder::default()
                .clear_targets()
                .targets([
                    Target::new(TargetKind::Webview),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("webview".into()),
                    })
                    .filter(|metadata| metadata.target() == WEBVIEW_TARGET),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("rust".into()),
                    })
                    .filter(|metadata| metadata.target() != WEBVIEW_TARGET),
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
        // Add app plugin
        .plugin(tauri_plugin_app::init())
        // Add window-state plugin
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // Add fs plugin
        .plugin(tauri_plugin_fs::init())
        // Add window plugin
        .plugin(tauri_plugin_window::init())
        // Add window plugin
        .plugin(tauri_plugin_dialog::init())
        // Add simple storage plugin
        .plugin(tauri_plugin_store::Builder::default().build())
        // Add aptabase plugin
        .plugin(tauri_plugin_aptabase::Builder::new(dotenv!("APTABASE_KEY")).build())
        // Add invoke handlers
        .invoke_handler(tauri::generate_handler![
            parsing::passthrough::parse_all_raws,
            parsing::passthrough::parse_all_raws_info,
            search_handler::prepare::parse_and_store_raws,
            search_handler::search::search_raws,
        ])
        .build(tauri::generate_context!())
        .expect("Error when building tauri app")
        .run(|handler, event| match event {
            tauri::RunEvent::Exit { .. } => {
                handler.track_event("app_exited", None);
                handler.flush_events_blocking();
            }
            tauri::RunEvent::Ready { .. } => {
                handler.track_event("app_started", None);
            }
            _ => {}
        });
}
