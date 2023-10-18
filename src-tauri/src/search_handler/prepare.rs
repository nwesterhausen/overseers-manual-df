use dfraw_json_parser::{options::ParserOptions, parser::raws::RawObject};
use std::sync::Mutex;
use tauri::{State, Window};

pub struct Storage {
    pub store: Mutex<Vec<Box<dyn RawObject>>>,
}

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn parse_and_store_raws(options: ParserOptions, window: Window, storage: State<Storage>) {
    // Get the raws with given options (and progress)
    let raws_vec = dfraw_json_parser::parse_with_tauri_emit(&options, window);
    // Store the raws in the storage, after clearing it
    storage.store.lock().unwrap().clear();
    storage.store.lock().unwrap().extend(raws_vec);
}
