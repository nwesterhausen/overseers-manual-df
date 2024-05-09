/// Definition of what data is tracked anonymously via Aptabase.
///
/// Each struct is named after the event that is tracked.
///
/// See the `src-tauri/tracking.rs` file for details on what is sent for tracking. It's anonymous tracking and
/// contains no way to reconnect an event source to a specific person.
///
/// These events are providing two main things: vague usage numbers (also version adaption), and performance metrics.
use serde::{Deserialize, Serialize};
use specta::Type;

/// Function: `parse_all_raws_info`
///
/// Tracked data is the duration of the event and the total number of files parsed, which
/// can allow for some interesting analysis.
#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "snake_case")]
pub struct ParseAllRawsInfo {
    /// The duration of the event.
    ///
    /// This is from `format!("{:?}", duration)` and usually looks something like "23.1234123ms"
    pub duration: String,
    /// The total number of files parsed.
    ///
    /// Can be used to calculate the average number of files parsed per second.
    pub total_files: usize,
}

/// Function: `parse_and_store_raws`
///
/// Tracked data is the duration of the event, the total number of files parsed, the duration
/// of storing the files, the total time elapsed, the types of raws parsed, and the locations
/// parsed from.
///
/// This function on the backend is responsible for parsing the raws and storing them in memory.
/// The instructions for what raws to parse and where to parse them from are provided by the
/// frontend.
#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "snake_case")]
pub struct ParseAndStoreRaws {
    /// The total number of files parsed.
    ///
    /// Can be used to calculate the average number of raws parsed per second.
    pub total_raws_parsed: usize,
    /// The total elapsed time.
    ///
    /// This is from `format!("{:?}", duration2_test)` and usually looks something like "23.1234123ms"
    pub elapsed_time: String,
    /// The types of raws parsed.
    ///
    /// This is from `json!(options.raws_to_parse).to_string()` and usually looks something like
    /// `[\"Creature\",\"MaterialTemplate\"]`
    pub parsed_raw_types: String,
    /// The locations parsed from.
    ///
    /// This is from `json!(options.locations_to_parse).to_string()` and usually looks something like
    /// `[\"Vanilla\",\"InstalledMods\"]`
    pub parsed_raw_locations: String,
}

/// Update Skipped
///
/// Tracked data is whether the update is skipped by the end user, and the versions involved.
#[derive(Type, Default, Debug, Serialize, Deserialize)]
pub struct SkipUpdate {
    /// The version the user is currently on.
    pub current_version: String,
    /// The version the user is skipping.
    pub to_version: String,
}

/// Apply Update
///
/// Tracked data is the versions involved.
#[derive(Type, Default, Debug, Serialize, Deserialize)]
pub struct ApplyUpdate {
    /// The version the user is applying.
    pub to_version: String,
}

/// App Launch
///
/// No data is collected, just the event.
#[derive(Type, Default, Debug, Serialize, Deserialize)]
pub struct AppStarted {}

/// App Exit
///
/// No data is collected, just the event.
#[derive(Type, Default, Debug, Serialize, Deserialize)]
pub struct AppExited {}
