use dfraw_parser_sqlite_lib::{SpriteGraphicData, TilePageData};
use serde::{Deserialize, Serialize};

/// Graphics query results
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct GraphicsResults {
    /// The resulting graphics
    pub matching_graphics: Vec<SpriteGraphicData>,
    /// The tile page(s) that the graphics are on
    pub tile_pages: Vec<TilePageData>,
}
