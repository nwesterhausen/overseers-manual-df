//! Build script for the Overseer's Manual. This script gathers build-time information.
fn main() {
    tauri_build::build();
    #[allow(clippy::expect_used)]
    // Collect some build-time information. This is used to populate the About dialog.
    // The information includes environment information and build dependencies.
    built::write_built_file().expect("Failed to acquire build-time information");
}
