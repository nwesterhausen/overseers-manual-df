#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::PathBuf;
use tauri_plugin_store::PluginBuilder;
// use tauri::{AppHandle, Runtime};

mod parser;

#[tauri::command]
fn parse_raws_at_path(path: &str) -> String {
    parser::parse_directory_to_json_string(path)
}

#[tauri::command]
fn parse_raws_at_path_to_file(path: &str, out_file: String) {
    parser::parse_directory_to_json_file(path, &PathBuf::from(out_file));
}

#[tauri::command]
fn parse_raws_in_file(path: &str) -> String {
    parser::parse_directory_to_json_string(path)
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![
            parse_raws_at_path,
            parse_raws_at_path_to_file,
            parse_raws_in_file
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
