use std::fs;
use std::path::Path;

pub fn rotate_logs(log_dir: &Path, log_name: &str, max_versions: usize) {
    // 1. Shift existing versions: app.log.1 -> app.log.2, etc.
    for i in (1..max_versions).rev() {
        let old_path = log_dir.join(format!("{}.{}", log_name, i));
        let new_path = log_dir.join(format!("{}.{}", log_name, i + 1));
        if old_path.exists() {
            let _ = fs::rename(old_path, new_path);
        }
    }

    // 2. Move current log to version 1: app.log -> app.log.1
    let current_log = log_dir.join(log_name);
    if current_log.exists() {
        let first_version = log_dir.join(format!("{}.1", log_name));
        let _ = fs::rename(current_log, first_version);
    }
}
