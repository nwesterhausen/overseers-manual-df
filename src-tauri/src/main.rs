#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder;
// use tauri::{AppHandle, Runtime};
use fern::colors::{Color, ColoredLevelConfig};

#[tauri::command]
fn parse_raws_at_game_path(path: &str, window: tauri::window::Window) -> String {
    let raws = dfraw_json_parser::parse_game_raws_with_tauri_emit(path, window);
    let mut final_json = "[".to_owned();
    final_json.push_str(raws.join(",").as_str());
    final_json.push(']');

    final_json
}

#[tauri::command]
fn parse_raws_info_at_game_path(path: &str) -> String {
    let raws_info = dfraw_json_parser::parse_raw_module_info(path);
    let mut final_json = "[".to_owned();
    final_json.push_str(raws_info.join(",").as_str());
    final_json.push(']');

    final_json
}

fn main() {
    // Setup logging
    // Specify color configuration
    let colors = ColoredLevelConfig::new()
        // Specify info as cyan
        .info(Color::Cyan);
    // Initialize logger
    match fern::Dispatch::new()
        // Perform allocation-free log formatting
        .format(move |out, message, record| {
            out.finish(format_args!(
                "{} [{}] {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                colors.color(record.level()),
                message
            ));
        })
        // Add blanket level filter -
        .level(log::LevelFilter::Info)
        // Output to stdout, files, and other Dispatch configurations
        .chain(std::io::stdout())
        // Apply globally
        .apply()
    {
        Ok(logger) => logger,
        Err(e) => {
            println!("Unable to start Fern: {:?}", e);
        }
    }

    let app = tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![
            parse_raws_at_game_path,
            parse_raws_info_at_game_path
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
