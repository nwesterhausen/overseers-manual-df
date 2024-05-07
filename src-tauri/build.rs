//! This file is used to build the Tauri application. It is used to build the Tauri application and
//! collect build-time information. This information is used to populate the About dialog in the
//! application.
fn main() {
    tauri_build::build();
    #[allow(clippy::expect_used)]
    // Collect some build-time information. This is used to populate the About dialog.
    // The information includes environment information and build dependencies.
    built::write_built_file().expect("Failed to acquire build-time information");
}
