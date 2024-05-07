use dfraw_json_parser::graphics::{Graphic, TilePage};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct GraphicsResults {
    /// The resulting graphics
    pub matching_graphics: Option<Vec<Graphic>>,
    /// The tile page(s) that the graphics are on
    pub tile_pages: Vec<TilePage>,
}
