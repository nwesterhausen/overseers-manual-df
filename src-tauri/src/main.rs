#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_store::PluginBuilder;
// use tauri::{AppHandle, Runtime};
use fern::colors::{Color, ColoredLevelConfig};

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthru to parse all raws at game path
fn parse_all_raws(game_path: &str, window: tauri::window::Window) -> String {
    dfraw_json_parser::parse_game_raws_with_tauri_emit(&game_path, window)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthru to parse all raws in raw location
fn parse_raws_in_module_location(module_location: &str, window: tauri::window::Window) -> String {
    dfraw_json_parser::parse_location_with_tauri_emit(&module_location, window)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthru to parse all raws in raw location
fn parse_graphics_raws_in_module_location(module_location: &str) -> String {
    dfraw_json_parser::parse_graphics_raw_location(&module_location)
}

// #[tauri::command]
// #[allow(clippy::needless_pass_by_value)]
// /// Passthru to parse all raws in raw location
// fn parse_raws_in_raw_module(raw_module_path: &str, window: tauri::window::Window) -> String {
//     dfraw_json_parser::parse_raw_module_with_tauri_emit(&module_location, &window)
// }

// #[tauri::command]
// #[allow(clippy::needless_pass_by_value)]
// /// Passthru to parse all raws in raw location
// fn parse_single_raw_file(raw_file_path: &str, window: tauri::window::Window) -> String {
//     dfraw_json_parser::parse_raw_file_with_tauri_emit(&module_location, &window)
// }

#[tauri::command]
/// Passthru to parse all info.txt files at game path
fn parse_all_raws_info(path: &str) -> String {
    dfraw_json_parser::parse_info_txt_in_game_dir(&path)
}

#[tauri::command]
fn parse_all_graphics_raws(path: &str) -> String {
    dfraw_json_parser::parse_game_graphic_raws(&path)
}

// #[tauri::command]
// /// Passthru to parse all info.txt files at location
// fn parse_raws_info_in_location(path: &str) -> String {
//     dfraw_json_parser::parse_info_txt_in_location(&path)
// }

// #[tauri::command]
// /// Passthru to parse the info.txt for a specific module
// fn parse_raws_info_in_module(path: &str) -> String {
//     dfraw_json_parser::parse_info_txt_in_module(&path)
// }

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

    // Launch the app
    let app = tauri::Builder::default()
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![
            parse_all_raws,
            parse_raws_in_module_location,
            parse_all_raws_info,
            parse_graphics_raws_in_module_location,
            parse_all_graphics_raws
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
