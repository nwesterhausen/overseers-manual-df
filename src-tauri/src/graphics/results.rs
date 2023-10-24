use dfraw_json_parser::parser::graphics::{raw::Graphic, tile_page::TilePage};
use serde::{Deserialize, Serialize};

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct GraphicsResults {
    /// The resulting graphics
    pub graphic: Option<Graphic>,
    /// The tile page(s) that the graphics are on
    pub tile_pages: Vec<TilePage>,
}
