use std::fs;
use std::path::Path;

use chrono::TimeDelta;

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

pub fn format_time_delta(delta: TimeDelta) -> String {
    let milliseconds = delta.num_milliseconds();

    if milliseconds == 0 {
        // If it's less than 1ms, show microseconds
        // num_microseconds returns Option<i64> (None on overflow), but if ms is 0, it fits.
        let micros = delta.num_microseconds().unwrap_or(0);
        format!("{}µs", micros)
    } else {
        format!("{}ms", milliseconds)
    }
}
