#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder;
// use tauri::{AppHandle, Runtime};
use simple_logger::SimpleLogger;

#[tauri::command]
fn parse_raws_at_game_path(path: &str) -> String {
    let raws = dfraw_json_parser::parse_game_raws(path);
    let mut final_json = "[".to_owned();
    final_json.push_str(raws.join(",").as_str());
    final_json.push(']');

    final_json
}

fn main() {
    // Setup logging
    match SimpleLogger::new()
        .with_colors(true)
        .with_level(log::LevelFilter::Info)
        .env()
        .init()
    {
        Ok(logger) => logger,
        Err(e) => {
            println!("Unable to start SimpleLogger: {:?}", e);
        }
    }

    let app = tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![parse_raws_at_game_path])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
