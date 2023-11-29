use dfraw_json_parser::{ModuleInfoFile, ParserOptions};
use itertools::Itertools;
use serde_json::json;
use tauri::AppHandle;
use tauri_plugin_aptabase::EventTracker;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthrough to parse all info.txt files at game path
pub async fn parse_raws_info(
    options: ParserOptions,
    app_handler: AppHandle,
) -> Vec<ModuleInfoFile> {
    let start = std::time::Instant::now();

    log::info!("parse_raws_info: options provided\n{:#?}", options);

    let results: Vec<_> = match dfraw_json_parser::parse(&options) {
        Ok(result) => result
            .info_files
            .iter()
            .filter(|module| module.get_identifier().to_lowercase() != "unknown")
            // Sort by object_id
            .sorted_by(|a, b| {
                a.get_object_id()
                    .to_lowercase()
                    .cmp(&b.get_object_id().to_lowercase())
            })
            .cloned()
            .collect(),
        Err(e) => {
            log::error!("Failure parsing: {e:?}");
            vec![]
        }
    };

    let duration = start.elapsed();
    log::info!(
        "parse_all_raws_info: {} module info files returned in {}",
        results.len(),
        format!("{:?}", duration)
    );
    let duration = format!("{duration:?}");
    app_handler.track_event(
        "parse_raws_info",
        Some(json!({
            "duration": duration,
            "total_files": results.len(),
        })),
    );

    results
}
