use dfraw_json_parser::traits::RawObject;
use serde::{Deserialize, Serialize};

/// Search results
#[derive(Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct SearchResults {
    /// The parsed raws returned
    pub results: Vec<Box<dyn RawObject>>,
    /// The total number of results
    pub total_results: usize,
    /// The total number of pages
    pub total_pages: usize,
}
