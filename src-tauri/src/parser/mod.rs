use serde_json::to_string;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;
use walkdir::WalkDir;

mod conversion;
mod parsing;
mod raws;
mod reader;

pub fn parse_directory_to_json_string(raws_directory: &str) -> String {
    turn_vec_into_json_string(parse_directory(raws_directory))
}

pub fn parse_directory_to_json_file(raws_directory: &str, out_directory: &Path) {
    save_vec_to_json_file(parse_directory(raws_directory), out_directory);
}

fn parse_directory(raws_directory: &str) -> Vec<raws::creature::DFCreature> {
    let mut creatures: Vec<raws::creature::DFCreature> = Vec::new();

    // Read all the files in the directory, selectively parse the .txt files
    for entry in WalkDir::new(raws_directory)
        .into_iter()
        .filter_map(std::result::Result::ok)
    {
        let f_name = entry.file_name().to_string_lossy();

        if f_name.ends_with(".txt") {
            let entry_path = entry.path().to_string_lossy().to_string();
            log::debug!("parsing {}", &entry_path);
            creatures.append(&mut reader::parse_file(&entry_path));
        }
    }
    log::debug!(
        "{} creatures parsed from directory {}",
        creatures.len(),
        &raws_directory
    );
    creatures
}

fn turn_vec_into_json_string(v: Vec<raws::creature::DFCreature>) -> String {
    let mut owned_string: String = "[".to_owned();
    owned_string.push_str(stringify_raw_vec(v).join(",").as_str());
    owned_string.push(']');
    log::debug!("JSON String is {} characters", owned_string.len());
    owned_string
}

fn save_vec_to_json_file(v: Vec<raws::creature::DFCreature>, out_directory: &Path) {
    // The destination file is out.json inside the out_directory
    let out_filepath = out_directory.join("out.json");
    let out_file = match File::create(&out_filepath.as_path()) {
        Ok(f) => f,
        Err(e) => {
            log::error!("Unable to open out.json for writing \n{:?}", e);
            return;
        }
    };

    let mut stream = BufWriter::new(out_file);
    let write_error = &format!("Unable to write to {}", out_filepath.to_string_lossy());
    match write!(stream, "[") {
        Ok(_x) => (),
        Err(e) => {
            log::error!("{}\n{:?}", write_error, e);
            return;
        }
    };

    match write!(stream, "{}", stringify_raw_vec(v).join(",")) {
        Ok(_x) => (),
        Err(e) => {
            log::error!("{}\n{:?}", write_error, e);
            return;
        }
    };
    match stream.flush() {
        Ok(_x) => (),
        Err(e) => {
            log::error!("{}\n{:?}", write_error, e);
            return;
        }
    };

    match write!(stream, "]") {
        Ok(_x) => (),
        Err(e) => {
            log::error!("{}\n{:?}", write_error, e);
            return;
        }
    };
    match stream.flush() {
        Ok(_x) => (),
        Err(e) => {
            log::error!("{}\n{:?}", write_error, e);
        }
    };
}

fn stringify_raw_vec(raws: Vec<raws::creature::DFCreature>) -> Vec<String> {
    let mut results: Vec<String> = Vec::new();
    if raws.is_empty() {
        return results;
    }
    log::debug!("{} creatures being serialized", raws.len());
    for creature in raws {
        match to_string(&conversion::WebCreature::from(&creature)) {
            Ok(s) => {
                results.push(s.to_string());
            }
            Err(e) => {
                log::error!("Failure to serialize creature\n{}", e);
            }
        }
    }
    results
}
