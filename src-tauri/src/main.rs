#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::PathBuf;
use tauri_plugin_store::PluginBuilder;
// use tauri::{AppHandle, Runtime};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

mod parser;

#[tauri::command]
fn parse_raws_at_path(path: String) -> String {
    parser::parse_directory_to_json_string(path)
}

#[tauri::command]
fn parse_raws_at_path_to_file(path: String, out_file: String) {
    parser::parse_directory_to_json_file(path, PathBuf::from(out_file))
}

#[tauri::command]
fn parse_raws_in_file(path: String) -> String {
    parser::parse_directory_to_json_string(path)
}

fn main() {

    let set_df_folder = CustomMenuItem::new("set_df_folder".to_string(), "Set DF Directory");
    let savechoice = Submenu::new("Change Save",Menu::new());
    let config = Submenu::new("Config", Menu::new().add_item(set_df_folder).add_item(savechoice));
    let menu = Menu::new()
        .add_submenu(config);

    tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![
            parse_raws_at_path,
            parse_raws_at_path_to_file,
            parse_raws_in_file
        ])
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
