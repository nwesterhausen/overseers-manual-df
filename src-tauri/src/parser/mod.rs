use serde_json::to_string;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::PathBuf;
use walkdir::WalkDir;

mod conversion;
mod raws;
mod reader;

pub fn parse_directory_to_json_string(raws_directory: String) -> String {
    turn_vec_into_json_string(parse_directory(raws_directory))
}

pub fn parse_directory_to_json_file(raws_directory: String, out_directory: PathBuf) {
    save_vec_to_json_file(parse_directory(raws_directory), out_directory)
}

fn parse_directory(raws_directory: String) -> Vec<raws::creature::DFCreature> {
    let mut creatures: Vec<raws::creature::DFCreature> = Vec::new();

    // Read all the files in the directory, selectively parse the .txt files
    for entry in WalkDir::new(&raws_directory)
        .into_iter()
        .filter_map(std::result::Result::ok)
    {
        let f_name = entry.file_name().to_string_lossy();

        if f_name.ends_with(".txt") {
            let entry_path = entry.path().to_string_lossy().to_string();
            // println!("parsing {}", &entry_path);
            creatures.append(&mut reader::parse_file(entry_path))
        }
    }
    println!(
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
    println!("JSON String is {} characters", owned_string.len());
    owned_string
}

fn save_vec_to_json_file(v: Vec<raws::creature::DFCreature>, out_directory: PathBuf) {
    // The destination file is out.json inside the out_directory
    let out_filepath = out_directory.join("out.json");
    let out_file =
        File::create(&out_filepath.as_path()).expect("Unable to open out.json for writing");

    let mut stream = BufWriter::new(out_file);
    let write_error = &format!("Unable to write to {}", out_filepath.to_string_lossy());
    write!(stream, "[").expect(write_error);

    write!(stream, "{}", stringify_raw_vec(v).join(",")).expect(write_error);
    stream.flush().expect(write_error);

    write!(stream, "]").expect(write_error);
    stream.flush().expect(write_error);
}

fn stringify_raw_vec(raws: Vec<raws::creature::DFCreature>) -> Vec<String> {
    let mut results: Vec<String> = Vec::new();
    for creature in raws {
        results.push(
            to_string(&conversion::WebCreature::from(creature))
                .unwrap()
                .to_string(),
        );
    }
    results
}
