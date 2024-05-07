use dfraw_json_parser::{biome::Token as Biome, ObjectType, RawModuleLocation};
use serde::{Deserialize, Serialize};

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
    /// Locations to include in the search results
    /// Default: All locations
    pub locations: Vec<RawModuleLocation>,
    /// Biomes to include in the search results
    /// Default: All biomes
    pub biomes: Vec<Biome>,
    /// Modules to include in the search results
    /// These are specified by their `object_id` which is unique
    /// Default: All modules
    pub modules: Vec<String>,
    /// Some specific tags we want to allow searching for as toggles.
    /// Default: false ; Requires creatures
    pub only_egg_layers: bool,
    /// Default: false ; Requires creatures
    pub show_does_not_exist: bool,
}
