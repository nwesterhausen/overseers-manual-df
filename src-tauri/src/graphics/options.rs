use serde::{Deserialize, Serialize};
use specta::Type;

/// Options for getting graphics for an object.
#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
pub struct GraphicsOptions {
    /// The identifier of the object we want to get graphics for
    pub identifier: String,
    /// Should we include all graphics for that `object_id` or just the first one?
    /// Default: false
    pub all_graphics: bool,
}
