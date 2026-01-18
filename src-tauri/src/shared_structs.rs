use dfraw_parser::{metadata::RawModuleLocation, Dimensions};
use serde::{Deserialize, Serialize};

/// Graphics query results
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct GraphicsResult {
    /// Path to tile page file
    pub file_path: String,
    /// The 'background-size' style for scaling
    pub bg_size: String,
    /// The 'background-position' style for indexing into the tile page
    pub bg_position: String,
    /// The tile-span of the sprite.
    ///
    /// For most is 1:1 but for some larger creatures could be 3:3 (this is not reduced)
    ///
    /// Some sprites are tall or wide, have 2:3 or 3:1 as aspect ratios.
    pub aspect_ratio: Dimensions,
    /// Sprite offset as pos x, y
    pub offset: Dimensions,
    /// Optional sprite 2nd offset (if large) as pos x, y
    pub offset_2: Option<Dimensions>,
    /// Tile size as x-px, y-px
    pub tile_dimensions: Dimensions,
    /// Page dimensions as x-tiles, y-tiles
    pub page_dimensions: Dimensions,
    /// Conditions of sprite
    pub description: String,
    /// The target identifier of the sprite
    pub target_identifier: String,
}

/// How the database should handle the parsed data
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub enum DbOptionOnParse {
    /// Insert only new data, avoiding overwriting anything existing
    #[default]
    InsertOnly,
    /// Replace any existing data, anything outside of what is parsed will still exist
    ForceUpdate,
    /// Reset the database before parsing
    Reset,
}

/// A parsing event log message
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct ParsingEventPayload {
    /// the log level
    pub level: String,
    /// the log message
    pub message: String,
}

/// Settings used in the app, for ease of loading/storing/state
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct StoredSettings {
    /// user-specified dwarf fortress directory
    pub df_directory: Option<String>,
    /// user-specified user data directory
    pub user_directory: Option<String>,
    /// selected locations to parse
    pub parse_locations: Vec<RawModuleLocation>,
    /// ? not sure if this makes sense, but the database location
    pub database_location: String,
    /// Whether to randomize when images are changed in the grid
    pub randomize_image_rotation: bool,
    /// Whether to have the app auto-detect the directories when parsing
    pub enable_directory_detection: bool,
    /// The specific startup action
    pub startup_action: String,
}
