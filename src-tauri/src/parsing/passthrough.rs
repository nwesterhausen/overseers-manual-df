use dfraw_json_parser::{
    options::{ParserOptions, ParsingJob},
    parser::{module_info_file::ModuleInfoFile, raws::RawObject},
};

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
/// Passthrough to parse all raws at game path
pub fn parse_all_raws(options: ParserOptions, window: tauri::Window) -> Vec<Box<dyn RawObject>> {
    dfraw_json_parser::parse_with_tauri_emit(&options, window)
}

#[tauri::command]
/// Passthrough to parse all info.txt files at game path
pub fn parse_all_raws_info(path: &str) -> Vec<ModuleInfoFile> {
    let mut options = ParserOptions::new(path);
    options.set_job(ParsingJob::AllModuleInfoFiles);
    options.attach_metadata_to_raws();

    log::error!("Calling parse_all_raws_info\n{:#?}", options);
    let results = dfraw_json_parser::parse_info_modules(&options);
    log::info!("Got {} results", results.len());

    results
}
