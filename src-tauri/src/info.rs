use serde::{Deserialize, Serialize};

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Info {
    pub version: String,
    pub rust_version: String,
    pub optimization_level: String,
    pub in_debug: bool,
    pub dependencies: Vec<(String, String)>,
    pub build_time: String,
    pub git_commit_hash: String,
}

pub mod build_time {
    include!(concat!(env!("OUT_DIR"), "/built.rs"));
}

#[tauri::command]
#[allow(clippy::module_name_repetitions)]
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
