use dfraw_json_parser::parser::raws::RawObject;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct SearchResults {
    pub results: Vec<Box<dyn RawObject>>,
    pub total_results: usize,
    pub total_pages: usize,
}
