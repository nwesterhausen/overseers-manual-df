use serde::{Deserialize, Serialize};

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Info {
    /// App Version
    pub version: String,
    /// Output of `rustc -V`
    pub rust_version: String,
    /// Compile-time optimization level
    pub optimization_level: String,
    /// Whether the app was built in debug mode
    pub in_debug: bool,
    /// Dependencies used to build the app (includes transitive dependencies)
    pub dependencies: Vec<(String, String)>,
    /// Build time in UTC
    pub build_time: String,
    /// Git commit hash
    pub git_commit_hash: String,
}

/// Include the build-time information from built.rs (via the build dependency `built`)
pub mod build_time {
    include!(concat!(env!("OUT_DIR"), "/built.rs"));
}

#[tauri::command]
#[allow(clippy::module_name_repetitions)]
/// The function `get_build_info` returns information about the build, including version, Rust version,
/// optimization level, debug status, dependencies, build time, and git commit hash.
/// 
/// Returns:
/// 
/// The function `get_build_info` returns an instance of the `Info` struct.
pub fn get_build_info() -> Info {
    Info {
        version: build_time::PKG_VERSION.to_string(),
        rust_version: build_time::RUSTC_VERSION.to_string(),
        optimization_level: build_time::OPT_LEVEL.to_string(),
        in_debug: build_time::DEBUG,
        dependencies: build_time::DEPENDENCIES
            .iter()
            .map(|(name, version)| ((*name).to_string(), (*version).to_string()))
            .collect(),
        build_time: build_time::BUILT_TIME_UTC.to_string(),
        git_commit_hash: build_time::GIT_COMMIT_HASH_SHORT
            .unwrap_or("(none)")
            .to_string(),
    }
}
