#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_log::LogTarget;

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
/// Passthru to parse all info.txt files at game path
fn parse_all_raws_info(path: &str) -> String {
    dfraw_json_parser::parse_info_txt_in_game_dir(&path)
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthru to parse all raws in raw location
fn parse_raws_in_locations(module_locations: Vec<String>, window: tauri::window::Window) -> String {
    let mut results: Vec<String> = vec![];
    for module_location in module_locations {
        let cloned_window = window.clone();
        results.push(dfraw_json_parser::parse_location_with_tauri_emit(
            &module_location,
            cloned_window,
        ));
    }
    format!("[{}]", results.join(","))
}

fn main() {
    // Launch the app
    let app = tauri::Builder::default()
        // Add simple storage plugin
        .plugin(tauri_plugin_store::Builder::default().build())
        // Add logging plugin
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
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
        // Add remember window state plugin
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            parse_all_raws,
            parse_raws_in_module_location,
            parse_all_raws_info,
            parse_raws_in_locations,
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
