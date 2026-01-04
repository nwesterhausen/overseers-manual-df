use std::path::PathBuf;

fn main() {
    // -- Output bindings for use in frontend. --
    let output_path = PathBuf::from("../src/bindings/DFRawParser.d.ts");
    // Create output directory if missing
    if let Some(parent) = output_path.parent() {
        std::fs::create_dir_all(parent).expect("Failed to create bindings directory");
    }
    dfraw_json_parser::generate_bindings(&output_path)
        .expect("Writing type bindings to file failed.");

    // -- Tauri build step, should be last? --
    tauri_build::build();
}
