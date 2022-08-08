use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use slug::slugify;

use super::{
    names::{Name, SingPlurName},
    tags::{self, CasteTag},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct DFCreature {
    identifier: String,
    parent_raw: String,
    #[serde(rename = "objectId")]
    object_id: String,

    // Boolean Flags
    pub tags: Vec<tags::CreatureTag>,

    // integers
    pub frequency: u16, //Defaults to 50 if not specified

    // [min, max] ranges
    pub cluster_number: [u16; 2],    //Defaults to 1:1 if not specified.
    pub population_number: [u16; 2], //default 1:1
    pub underground_depth: [u16; 2], //default 0:0 (aboveground)

    // strings
    pub general_baby_name: SingPlurName,
    pub general_child_name: SingPlurName,
    pub name: Name,

    // Listicle
    pub biomes: Vec<String>,
    pub pref_string: Vec<String>,

    // sub definitions
    pub castes: Vec<DFCreatureCaste>,

    // copy_from
    pub copy_tags_from: Vec<String>, // vec of creature identifiers
}

impl Clone for DFCreature {
    fn clone(&self) -> Self {
        Self {
            identifier: self.identifier.to_string(),
            parent_raw: self.identifier.to_string(),
            object_id: self.identifier.to_string(),
            tags: self.tags.clone(),
            frequency: self.frequency,
            cluster_number: [self.cluster_number[0], self.cluster_number[1]],
            population_number: [self.population_number[0], self.population_number[1]],
            underground_depth: [self.underground_depth[0], self.underground_depth[1]],
            general_baby_name: self.general_baby_name.clone(),
            general_child_name: self.general_child_name.clone(),
            name: self.name.clone(),
            biomes: self.biomes.clone(),
            pref_string: self.pref_string.clone(),
            castes: self.castes.clone(),
            copy_tags_from: self.copy_tags_from.clone(),
        }
    }
}

impl Clone for DFCreatureCaste {
    fn clone(&self) -> Self {
        Self {
            name: self.name.to_string(),
            tags: self.tags.clone(),
            clutch_size: [self.clutch_size[0], self.clutch_size[1]],
            litter_size: [self.clutch_size[0], self.clutch_size[1]],
            max_age: [self.max_age[0], self.max_age[1]],
            active_time: self.active_time,
            curious_beast: self.curious_beast,
            no_season: self.no_season,
            trainable: self.trainable,
            baby: self.baby,
            child: self.child,
            difficulty: self.difficulty,
            egg_size: self.egg_size,
            grass_trample: self.grass_trample,
            grazer: self.grazer,
            low_light_vision: self.low_light_vision,
            pet_value: self.pet_value,
            pop_ratio: self.pop_ratio,
            baby_name: self.baby_name.clone(),
            caste_name: self.caste_name.clone(),
            child_name: self.child_name.clone(),
            description: self.description.to_string(),
            creature_class: self.creature_class.clone(),
            body_size: self.body_size.clone(),
            milkable: self.milkable.clone(),
        }
    }
}
#[derive(Serialize, Deserialize, Debug)]
pub struct DFCreatureCaste {
    // Identification
    pub name: String,
    // Boolean Flags
    pub tags: Vec<tags::CasteTag>,

    // [min, max] ranges
    pub clutch_size: [u16; 2],
    pub litter_size: [u16; 2],
    pub max_age: [u16; 2],

    // Combo flags (custom)
    pub active_time: u8, // MATUTINAL/DIURNAL/NOCTURNAL/CREPUSCULAR/VESPERTINE via binary math
    pub curious_beast: u8, // EATER/GUZZLER/ITEM via binary math
    pub no_season: u8,   // NO_SPRING/NO_SUMMER/NO_AUTUMN/NO_WINTER
    pub trainable: u8,   // trainable_HUNTING/trainable_WAR/BOTH(aka trainable)

    // Integer tokens
    pub baby: u32,
    pub child: u32,
    pub difficulty: u32,
    pub egg_size: u32,
    pub grass_trample: u8,
    pub grazer: u32,
    pub low_light_vision: u32,
    pub pet_value: u16,
    pub pop_ratio: u16,

    // String Tokens
    pub baby_name: SingPlurName,
    pub caste_name: Name,
    pub child_name: SingPlurName,
    pub description: String,

    // listicles
    pub creature_class: Vec<String>,

    // Custom tokens
    pub body_size: Vec<tags::DFBodySize>,
    pub milkable: tags::DFMilkable,
}

impl DFCreature {
    pub fn new(raw: &str, id: &str) -> Self {
        Self {
            identifier: String::from(id),
            parent_raw: String::from(raw),
            object_id: format!("{}-{}-{}", raw, "CREATURE", slugify(id)),
            // Boolean Flags
            tags: Vec::new(),

            // integers
            frequency: 50, //Defaults to 50 if not specified

            // [min, max] ranges
            cluster_number: [1, 1],    //Defaults to 1:1 if not specified.
            population_number: [1, 1], //default 1:1
            underground_depth: [0, 0], //default 0:0 (aboveground)

            // strings
            general_baby_name: SingPlurName::new(""),
            general_child_name: SingPlurName::new(""),
            name: Name::new(""),

            // Listicle
            biomes: Vec::new(),
            pref_string: Vec::new(),

            // sub definitions
            castes: Vec::new(),

            // copy_from
            copy_tags_from: Vec::new(), // vec of creature identifiers
        }
    }
    pub fn get_identifier(&self) -> String {
        String::from(&self.identifier)
    }
    pub fn get_parent_raw(&self) -> String {
        String::from(&self.parent_raw)
    }
    pub fn get_object_id(&self) -> String {
        String::from(&self.object_id)
    }
    pub fn get_general_name(&self) -> String {
        self.name.to_string_vec()[0].to_string()
    }
    pub fn get_names_by_caste(&self) -> HashMap<String, Vec<String>> {
        let mut names_map: HashMap<String, Vec<String>> = HashMap::new();
        names_map.insert("SPECIES".to_string(), self.name.to_string_vec());
        if !self.general_baby_name.to_string_vec()[0].is_empty() {
            names_map.insert(
                "baby_SPECIES".to_string(),
                self.general_baby_name.to_string_vec(),
            );
        }
        if !self.general_child_name.to_string_vec()[0].is_empty() {
            names_map.insert(
                "child_SPECIES".to_string(),
                self.general_child_name.to_string_vec(),
            );
        }
        for self_caste in &self.castes {
            if !self_caste.baby_name.to_string_vec()[0].is_empty() {
                names_map.insert(
                    format!("baby_{}", self_caste.name),
                    self_caste.baby_name.to_string_vec(),
                );
            }
            if !self_caste.child_name.to_string_vec()[0].is_empty() {
                names_map.insert(
                    format!("child_{}", self_caste.name),
                    self_caste.child_name.to_string_vec(),
                );
            }
            if !self_caste.caste_name.to_string_vec()[0].is_empty() {
                names_map.insert(
                    self_caste.name.to_string(),
                    self_caste.caste_name.to_string_vec(),
                );
            }
        }
        names_map
    }
    pub fn get_description_by_caste(&self) -> HashMap<String, String> {
        let mut descriptions: HashMap<String, String> = HashMap::new();
        for self_caste in &self.castes {
            descriptions.insert(
                String::from(&self_caste.name),
                String::from(&self_caste.description),
            );
        }
        descriptions
    }
    pub fn get_max_ages_by_caste(&self) -> HashMap<String, [u16; 2]> {
        let mut max_ages: HashMap<String, [u16; 2]> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.max_age[0] != self_caste.max_age[1] && self_caste.max_age[1] != 0 {
                max_ages.insert(String::from(&self_caste.name), self_caste.max_age);
            }
        }
        max_ages
    }
    pub fn get_clutch_sizes_by_caste(&self) -> HashMap<String, [u16; 2]> {
        let mut clutch_sizes: HashMap<String, [u16; 2]> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.clutch_size[0] != self_caste.clutch_size[1]
                && self_caste.clutch_size[1] != 0
            {
                clutch_sizes.insert(String::from(&self_caste.name), self_caste.clutch_size);
            }
        }
        clutch_sizes
    }
    pub fn get_body_sizes_by_caste(&self) -> HashMap<String, Vec<tags::DFBodySize>> {
        let mut body_sizes: HashMap<String, Vec<tags::DFBodySize>> = HashMap::new();
        for self_caste in &self.castes {
            let caste_body_sizes = Vec::clone(&self_caste.body_size);
            body_sizes.insert(String::from(&self_caste.name), caste_body_sizes);
        }
        body_sizes
    }
    pub fn get_milkable_by_caste(&self) -> HashMap<String, tags::DFMilkable> {
        let mut milkable: HashMap<String, tags::DFMilkable> = HashMap::new();
        for self_caste in &self.castes {
            if !self_caste.milkable.is_empty() {
                milkable.insert(String::from(&self_caste.name), self_caste.milkable.clone());
            }
        }
        milkable
    }
    pub fn get_child_ages_by_caste(&self) -> HashMap<String, u32> {
        let mut child_ages: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.baby != 0 {
                child_ages.insert(String::from(&self_caste.name), self_caste.baby);
            }
        }
        child_ages
    }
    pub fn get_grown_at_ages_by_caste(&self) -> HashMap<String, u32> {
        let mut grown_at_ages: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.child != 0 {
                grown_at_ages.insert(String::from(&self_caste.name), self_caste.child);
            }
        }
        grown_at_ages
    }
    pub fn get_difficulty_by_caste(&self) -> HashMap<String, u32> {
        let mut difficulty: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.child != 0 {
                difficulty.insert(String::from(&self_caste.name), self_caste.difficulty);
            }
        }
        difficulty
    }
    pub fn get_grass_trample_by_caste(&self) -> HashMap<String, u8> {
        let mut grass_trample: HashMap<String, u8> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.grass_trample != 0 {
                grass_trample.insert(String::from(&self_caste.name), self_caste.grass_trample);
            }
        }
        grass_trample
    }
    pub fn get_grazer_by_caste(&self) -> HashMap<String, u32> {
        let mut grazer: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.grazer != 0 {
                grazer.insert(String::from(&self_caste.name), self_caste.grazer);
            }
            if self_caste.tags.contains(&CasteTag::StandardGrazer) {
                match self_caste.body_size.last() {
                    Some(body_size) => {
                        let graze_value: f64 = 20_000.0
                            * 100.0
                            * (f64::powf(f64::from(body_size.size_cm3() / 10), -0.75));
                        let graze_int = format!("{}", graze_value.round());
                        log::info!("{}:graze val = {}", &self.identifier, graze_value);
                        match graze_int.as_str().parse::<u32>() {
                            Ok(n) => {
                                if n < 150 {
                                    grazer.insert(String::from(&self_caste.name), 150);
                                } else {
                                    grazer.insert(String::from(&self_caste.name), n);
                                }
                            }
                            Err(e) => {
                                log::warn!(
                                    "{}:Unable to create GRAZER value from StandardGrazer",
                                    &self.identifier
                                );
                                log::warn!("{:?}", e);
                            }
                        }
                    }
                    None => (),
                }
            }
        }
        grazer
    }
    pub fn get_low_light_vision_by_caste(&self) -> HashMap<String, u32> {
        let mut low_light_vision: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.low_light_vision != 0 {
                low_light_vision
                    .insert(String::from(&self_caste.name), self_caste.low_light_vision);
            }
        }
        low_light_vision
    }
    pub fn get_egg_sizes_by_caste(&self) -> HashMap<String, u32> {
        let mut values: HashMap<String, u32> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.tags.contains(&tags::CasteTag::LaysEggs) {
                values.insert(String::from(&self_caste.name), self_caste.egg_size);
            }
        }
        values
    }
    pub fn get_pet_value_by_caste(&self) -> HashMap<String, u16> {
        let mut pet_values: HashMap<String, u16> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.pet_value > 0 {
                pet_values.insert(String::from(&self_caste.name), self_caste.pet_value);
            }
        }
        pet_values
    }
    pub fn get_pop_ratio_by_caste(&self) -> HashMap<String, u16> {
        let mut pop_ratio: HashMap<String, u16> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.pop_ratio > 0 {
                pop_ratio.insert(String::from(&self_caste.name), self_caste.pop_ratio);
            }
        }
        pop_ratio
    }
    pub fn get_intelligence_by_caste(&self) -> HashMap<String, [bool; 2]> {
        let mut intelligence: HashMap<String, [bool; 2]> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.tags.contains(&tags::CasteTag::Intelligent) {
                intelligence.insert(String::from(&self_caste.name), [true, true]);
            }
            if self_caste.tags.contains(&tags::CasteTag::CanLearn)
                || self_caste.tags.contains(&tags::CasteTag::CanSpeak)
            {
                intelligence.insert(
                    String::from(&self_caste.name),
                    [
                        self_caste.tags.contains(&tags::CasteTag::CanLearn),
                        self_caste.tags.contains(&tags::CasteTag::CanSpeak),
                    ],
                );
            }
        }
        // Handle the case when the creature is not intelligent
        if intelligence.is_empty() {
            intelligence.insert(String::from("ALL"), [false, false]);
        }
        intelligence
    }
    pub fn get_gnawer_by_caste(&self) -> HashMap<String, bool> {
        let mut gnawer: HashMap<String, bool> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.tags.contains(&tags::CasteTag::Gnawer) {
                gnawer.insert(
                    String::from(&self_caste.name),
                    self_caste.tags.contains(&tags::CasteTag::Gnawer),
                );
            }
        }
        gnawer
    }
    pub fn get_flier_by_caste(&self) -> HashMap<String, bool> {
        let mut flier: HashMap<String, bool> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.tags.contains(&tags::CasteTag::Flier) {
                flier.insert(
                    String::from(&self_caste.name),
                    self_caste.tags.contains(&tags::CasteTag::Flier),
                );
            }
        }
        flier
    }
    pub fn get_trainable_by_caste(&self) -> HashMap<String, u8> {
        let mut trainable: HashMap<String, u8> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.trainable > 0 {
                trainable.insert(String::from(&self_caste.name), self_caste.trainable);
            }
        }
        trainable
    }
    pub fn get_active_time_by_caste(&self) -> HashMap<String, u8> {
        let mut active_time: HashMap<String, u8> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.active_time > 0 {
                active_time.insert(String::from(&self_caste.name), self_caste.active_time);
            }
        }
        active_time
    }
    pub fn get_inactive_season_by_caste(&self) -> HashMap<String, u8> {
        let mut no_season: HashMap<String, u8> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.no_season > 0 {
                no_season.insert(String::from(&self_caste.name), self_caste.no_season);
            }
        }
        no_season
    }
    pub fn get_creature_class_by_caste(&self) -> HashMap<String, Vec<String>> {
        let mut creature_class: HashMap<String, Vec<String>> = HashMap::new();
        for self_caste in &self.castes {
            if !self_caste.creature_class.is_empty() {
                creature_class.insert(
                    String::from(&self_caste.name),
                    Vec::clone(&self_caste.creature_class),
                );
            }
        }
        creature_class
    }
    pub fn get_caste_tags(&self) -> HashMap<String, Vec<CasteTag>> {
        let mut tags: HashMap<String, Vec<CasteTag>> = HashMap::new();
        for self_caste in &self.castes {
            tags.insert(String::from(&self_caste.name), Vec::clone(&self_caste.tags));
        }
        tags
    }
}

impl DFCreatureCaste {
    pub fn new(name: &str) -> Self {
        Self {
            // Identification
            name: String::from(name),
            // Boolean Flags
            tags: Vec::new(),

            // [min, max] ranges
            clutch_size: [0, 0],
            litter_size: [0, 0],
            max_age: [0, 0],

            // Combo flags (custom)
            active_time: 0, // MATUTINAL/DIURNAL/NOCTURNAL/CREPUSCULAR/VESPERTINE via binary math
            curious_beast: 0, // EATER/GUZZLER/ITEM via binary math
            no_season: 0,   // NO_SPRING/NO_SUMMER/NO_AUTUMN/NO_WINTER
            trainable: 0,   // trainable_HUNTING/trainable_WAR/BOTH(aka trainable)

            // Integer tokens
            baby: 0,
            child: 0,
            difficulty: 0,
            egg_size: 0,
            grass_trample: 0,
            grazer: 0,
            low_light_vision: 0,
            pet_value: 0,
            pop_ratio: 0,

            // String Tokens
            baby_name: SingPlurName::new(""),
            caste_name: Name::new(""),
            child_name: SingPlurName::new(""),
            description: String::new(),

            // listicles
            creature_class: Vec::new(),

            // Custom tokens
            body_size: Vec::new(),
            milkable: tags::DFMilkable::new("", 0),
        }
    }
}
