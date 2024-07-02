use dfraw_json_parser::{Graphic, TilePage};
use serde::{Deserialize, Serialize};
use specta::Type;

/// Graphics search results
#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct GraphicsResults {
    /// The resulting graphics
    pub matching_graphics: Option<Vec<Graphic>>,
    /// The tile page(s) that the graphics are on
    pub tile_pages: Vec<TilePage>,
}
