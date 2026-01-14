use dfraw_parser::Dimensions;
use serde::{Deserialize, Serialize};

/// Graphics query results
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct GraphicsResult {
    /// Path to tile page file
    pub file_path: String,
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
    /// Position offselt used on frontend
    pub position_offset: Dimensions,
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
