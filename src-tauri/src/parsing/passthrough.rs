use dfraw_json_parser::{
    options::{ParserOptions, ParsingJob},
    parser::module_info_file::ModuleInfoFile,
};

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
