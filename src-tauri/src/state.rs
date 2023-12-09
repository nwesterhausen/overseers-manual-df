use std::{collections::HashMap, sync::Mutex};

use dfraw_json_parser::{
    graphics::{Graphic, TilePage},
    ModuleInfoFile, RawObject,
};

/// The shared state storage used by the tauri app. This enables us to do the
/// search in the background thread and then return the results to the main
/// thread.
///
/// Basically, when we parse the raw files, we store them in `store` and then
/// we store the search strings and their index in `search_lookup`. This way,
/// we can search the `search_lookup` in the background thread and then return
/// the results to the main thread, which can then use the index to get the
/// actual raw object from `store`.
pub struct Storage {
    /// Holds all the parsed raws.
    ///
    /// This might make more sense to be either split into multiple stores by
    /// ObjectType? Right now, everything is here and there's some extra conversion
    /// and reading steps required to go from the search_lookup to raw object.
    ///
    /// If the search_lookup was a map of search_string -> object_id it might make
    /// sense to have multiple stores (and efficient). It would mean a lot less work
    /// if users are not concerned with searching for everything, and instead are
    /// looking at a certain type of object.
    pub store: Mutex<Vec<Box<dyn RawObject>>>,
    /// Holds all the search strings for every raw and their index in `store`
    pub search_lookup: Mutex<Vec<(String, usize)>>,
}

/// Specific storage for graphics and tile pages.
///
/// This is separate from the `Storage` struct because it reduces the locks on
/// the `Storage` struct. We don't need to lock the `Storage` struct when we're
/// just looking for graphics or tile pages.
///
/// The `graphics_store` and `tile_page_store` are used to store the graphics
/// and tile pages parsed from the raws. This is done so that we don't have to
/// parse the raws every time we want to get a graphic or tile page.
pub struct GraphicStorage {
    /// Holds all graphics by their identifier
    pub graphics_store: Mutex<HashMap<String, Vec<Graphic>>>,
    /// Holds all tile pages by their identifier
    pub tile_page_store: Mutex<HashMap<String, TilePage>>,
}

/// Storage for module info files.
///
/// This is separate from the `Storage` struct because it reduces the locks on
/// the `Storage` struct. We don't need to lock the `Storage` struct when we're
/// just looking for module info files.
pub struct ModuleInfoStorage {
    /// Holds all module info files
    pub module_info_store: Mutex<Vec<ModuleInfoFile>>,
}
