use tauri_plugin_log::{Target, TargetKind, WEBVIEW_TARGET};

mod parsing;
mod search_handler;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Launch the app
    let app = tauri::Builder::default()
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
        // Add fs plugin
        .plugin(tauri_plugin_fs::init())
        // Add window plugin
        .plugin(tauri_plugin_window::init())
        // Add window plugin
        .plugin(tauri_plugin_dialog::init())
        // Add simple storage plugin
        .plugin(tauri_plugin_store::Builder::default().build())
        // Add invoke handlers
        .invoke_handler(tauri::generate_handler![
            parsing::passthrough::parse_all_raws,
            parsing::passthrough::parse_all_raws_info,
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
