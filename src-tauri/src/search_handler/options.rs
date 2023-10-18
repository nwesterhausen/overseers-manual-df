use dfraw_json_parser::parser::object_types::ObjectType;
use serde::{Deserialize, Serialize};

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct SearchOptions {
    /// Number of results to return
    /// Default: 16
    pub limit: usize,
    /// Page of results to return
    /// Default: 1
    /// Note: This is 1-indexed, not 0-indexed
    pub page: usize,
    /// Object types to include in the search
    /// Default: All object types
    pub object_types: Vec<ObjectType>,
    /// Search query
    /// Default: ""
    pub query: String,
}
