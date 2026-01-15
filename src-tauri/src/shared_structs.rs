use dfraw_parser::Dimensions;
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
