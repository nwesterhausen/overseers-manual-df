use dfraw_json_parser::{
    options::{ParserOptions, ParsingJob},
    parser::module_info_file::ModuleInfoFile,
};
use serde_json::json;
use tauri::AppHandle;
use tauri_plugin_aptabase::EventTracker;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthrough to parse all info.txt files at game path
pub fn parse_all_raws_info(path: &str, app_handler: AppHandle) -> Vec<ModuleInfoFile> {
    let start = std::time::Instant::now();
    let mut options = ParserOptions::new(path);
    options.set_job(ParsingJob::AllModuleInfoFiles);
    options.attach_metadata_to_raws();

    log::info!("parse_all_raws_info: options provided\n{:#?}", options);
    let results = dfraw_json_parser::parse_info_modules(&options);
    let duration = start.elapsed();
    log::info!(
        "parse_all_raws_info: {} module info files returned in {}",
        results.len(),
        format!("{:?}", duration)
    );
    let duration = format!("{duration:?}");
    app_handler.track_event(
        "parse_all_raws_info",
        Some(json!({
            "duration": duration,
            "total_files": results.len(),
        })),
    );

    results
}
