fn main() {
    tauri_build::build();
    #[allow(clippy::expect_used)]
    built::write_built_file().expect("Failed to acquire build-time information");
}
