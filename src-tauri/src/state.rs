use std::{collections::HashMap, sync::Mutex};

use dfraw_json_parser::parser::{
    graphics::{raw::Graphic, tile_page::TilePage},
    raws::RawObject,
};

/// The shared state storage used by the tauri app. This enables us to do the
/// search in the background thread and then return the results to the main
/// thread.
pub struct Storage {
    /// Holds all the parsed raws.
    pub store: Mutex<Vec<Box<dyn RawObject>>>,
    /// Holds all the search strings for every raw and their index in `store`
    pub search_lookup: Mutex<Vec<(String, usize)>>,
    /// Holds all graphics by their identifier
    pub graphics_store: Mutex<HashMap<String, Graphic>>,
    /// Holds all tile pages by their identifier
    pub tile_page_store: Mutex<HashMap<String, TilePage>>,
}
