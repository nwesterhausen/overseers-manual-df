use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::raws::{
    creature::DFCreature,
    tags::{CasteTag, CreatureTag, DFBodySize, DFMilkable},
};

// Creature Object for Web Consumption
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WebCreature {
    identifier: String,
    parent_raw: String,
    #[serde(rename = "objectId")]
    object_id: String,
    name: String,
    names_map: HashMap<String, Vec<String>>,
    descriptions: HashMap<String, String>,
    max_age: HashMap<String, [u16; 2]>,
    clutch_size: HashMap<String, [u16; 2]>,
    based_on: String,
    biomes: Vec<String>,
    cluster_range: [u16; 2],
    underground_depth: [u16; 2],
    body_size: HashMap<String, Vec<DFBodySize>>,
    grown_at: HashMap<String, u32>,
    child_at: HashMap<String, u32>,
    egg_sizes: HashMap<String, u32>,
    pet_value: HashMap<String, u16>,
    intelligence: HashMap<String, [bool; 2]>,
    flier: HashMap<String, bool>,
    gnawer: HashMap<String, bool>,
    trainable: HashMap<String, u8>,
    active_time: HashMap<String, u8>,
    inactive_season: HashMap<String, u8>,
    creature_class: HashMap<String, Vec<String>>,
    tags: Vec<CreatureTag>,
    caste_tags: HashMap<String, Vec<CasteTag>>,
    difficulty: HashMap<String, u32>,
    grass_trample: HashMap<String, u8>,
    grazer: HashMap<String, u32>,
    low_light_vision: HashMap<String, u32>,
    pop_ratio: HashMap<String, u16>,
    milkable: HashMap<String, DFMilkable>,
    pref_string: Vec<String>,
    population_number: [u16; 2],
}

impl WebCreature {
    pub fn from(creature: &DFCreature) -> Self {
        Self {
            identifier: creature.get_identifier(),
            parent_raw: creature.get_parent_raw(),
            object_id: creature.get_object_id(),
            name: creature.get_general_name(),
            descriptions: creature.get_description_by_caste(),
            max_age: creature.get_max_ages_by_caste(),
            clutch_size: creature.get_clutch_sizes_by_caste(),
            based_on: creature.copy_tags_from.join(""),
            biomes: Vec::clone(&creature.biomes),
            cluster_range: creature.cluster_number,
            underground_depth: creature.underground_depth,
            body_size: creature.get_body_sizes_by_caste(),
            grown_at: creature.get_grown_at_ages_by_caste(),
            names_map: creature.get_names_by_caste(),
            egg_sizes: creature.get_egg_sizes_by_caste(),
            pet_value: creature.get_pet_value_by_caste(),
            intelligence: creature.get_intelligence_by_caste(),
            flier: creature.get_flier_by_caste(),
            gnawer: creature.get_gnawer_by_caste(),
            trainable: creature.get_trainable_by_caste(),
            active_time: creature.get_active_time_by_caste(),
            inactive_season: creature.get_inactive_season_by_caste(),
            creature_class: creature.get_creature_class_by_caste(),
            tags: Vec::clone(&creature.tags),
            caste_tags: creature.get_caste_tags(),
            difficulty: creature.get_difficulty_by_caste(),
            grass_trample: creature.get_grass_trample_by_caste(),
            grazer: creature.get_grazer_by_caste(),
            child_at: creature.get_child_ages_by_caste(),
            low_light_vision: creature.get_low_light_vision_by_caste(),
            milkable: creature.get_milkable_by_caste(),
            pop_ratio: creature.get_pop_ratio_by_caste(),
            pref_string: creature.pref_string.clone(),
            population_number: creature.population_number,
        }
    }
}
