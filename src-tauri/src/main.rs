#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use dfraw_json_parser::{
    options::{ParserOptions, ParsingJob},
    parser::raw_locations::RawModuleLocation,
};
use tauri_plugin_log::LogTarget;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthru to parse all raws at game path
fn parse_all_raws(
    game_path: &str,
    window: tauri::window::Window,
    include_vanilla: bool,
    include_installed_mods: bool,
    include_downloaded_mods: bool,
) -> String {
    let mut options = ParserOptions::new(game_path);
    options.attach_metadata_to_raws();

    let mut locations: Vec<RawModuleLocation> = Vec::new();
    if include_vanilla {
        locations.push(RawModuleLocation::Vanilla);
    }
    if include_installed_mods {
        locations.push(RawModuleLocation::InstalledMods);
    }
    if include_downloaded_mods {
        locations.push(RawModuleLocation::Mods);
    }

    if locations.is_empty() {
        return String::from("[]");
    }
    if locations.len() == 1usize {
        options.set_job(ParsingJob::SingleLocation);
    }
    options.set_locations_to_parse(locations);

    log::error!("Calling parse_all_raws\n{:#?}", options);
    dfraw_json_parser::parse_with_tauri_emit(&options, window)
}

#[tauri::command]
/// Passthru to parse all info.txt files at game path
fn parse_all_raws_info(path: &str) -> String {
    let mut options = ParserOptions::new(path);
    options.set_job(ParsingJob::AllModuleInfoFiles);
    options.attach_metadata_to_raws();

    log::error!("Calling parse_all_raws_info\n{:#?}", options);
    let results = dfraw_json_parser::parse_info_modules_to_json(&options);
    log::info!("Got {} results", results.len());
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
            parse_all_raws_info,
        ])
        .run(tauri::generate_context!());

    match app {
        Ok(app) => app,
        Err(error) => println!("{:?}", error),
    }
}
