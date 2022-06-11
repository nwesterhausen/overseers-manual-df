use super::names::{Name, SingPlurName};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Wiki link to plant_token details:
// https://www.dwarffortresswiki.org/index.php/DF2014:Plant_token

// Plant Raw
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFPlant {
    identifier: String,
    parent_raw: String,
    #[serde(rename = "objectId")]
    object_id: String,
    // BASIC TOKENS
    // These tokens are specified for all plants and define them at a base level
    pub name: String,
    pub name_plural: String,
    pub adj: String,
    pub all_names: Name,
    pub prefstring: String,
    // ENVIRONMENT TOKENS
    // These tokens, also applicable to all plants, specify where the plants grow.
    pub good: bool,
    pub evil: bool,
    pub savage: bool,
    pub frequency: u16,
    pub wet: bool,
    pub dry: bool,
    pub underground_depth: [u16; 2],
    pub biomes: Vec<String>,

    // sub definitions
    pub growths: Vec<DFPlantGrowth>,

    // optional definitions
    pub shrub_tokens: Option<ShrubToken>,
}

// GROWTH TOKENS (this is a nested set of tokens)
// These tokens are used for all plants and specify growths growing on a plant.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFPlantGrowth {
    pub growth: String,
    pub growth_name: SingPlurName,
    pub growth_item: GrowthItem,
    pub growth_host_tile: String,
    pub growth_trunk_height_perc: [u16; 2],
    pub growth_density: u32,
    pub growth_timing: [u32; 2],
    pub growth_print: GrowthPrint,
    pub growth_has_seed: bool,
    pub growth_drops_off: bool,
    pub growth_drops_off_no_cloud: bool,
}

// Specifies the appearance of the growth. Can be specified more than once, for example for autumn leaves. Transitions between different timing periods will happen gradually over the course of 2000 ticks.
// The GROWTH_PRINT tile will only be displayed when the growth in question is actually present, even if its timing parameter is ALL.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GrowthPrint {
    pub overworld_tile: String,
    pub item_tile: String,
    pub color: u16,
    pub time: [String; 2],
    pub priority: u16,
}

// Specifies what item this growth is and what it is made of. Generally, the item type should be PLANT_GROWTH:NONE.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GrowthItem {
    pub item: String,
    pub material: String,
}

// growing_season (plant growable in plots):
//      SPRING & SUMMER & AUTUMN & WINTER = 15
pub static SPRING: u8 = 1;
pub static SUMMER: u8 = 2;
pub static FALL: u8 = 4;
pub static WINTER: u8 = 8;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ShrubToken {
    pub growing_season: u8,
}
