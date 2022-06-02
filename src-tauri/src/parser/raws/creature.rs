use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use slug::slugify;

use super::names::{Name, SingPlurName};

// Creature Raw

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFCreature {
    identifier: String,
    parent_raw: String,
    #[serde(rename = "objectId")]
    object_id: String,
    // Boolean Flags
    pub artificial_hiveable: bool,
    pub does_not_exist: bool,
    pub evil: bool,
    pub fanciful: bool,
    pub generated: bool,
    pub good: bool,
    pub large_roaming: bool,
    pub local_pops_controllable: bool,
    pub local_pops_produce_heroes: bool,
    pub loose_clusters: bool,
    pub mundane: bool,
    pub savage: bool,
    pub ubiquitous: bool,
    pub vermin_eater: bool,
    pub vermin_fish: bool,
    pub vermin_grounder: bool,
    pub vermin_rotter: bool,
    pub vermin_soil: bool,
    pub vermin_soil_colony: bool,

    // integers
    pub frequency: u16, //Defaults to 50 if not specified

    // [min, max] ranges
    pub cluster_number: [u16; 2],    //Defaults to 1:1 if not specified.
    pub population_number: [u16; 2], //default 1:1

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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFCreatureCaste {
    // Identification
    name: String,
    // Boolean Flags
    pub adopts_owner: bool,
    pub ambush_predator: bool,
    pub amphibious: bool,
    pub aquatic: bool,
    pub arena_restricted: bool,
    pub at_peace_with_wildlife: bool,
    pub benign: bool,
    pub bone_carnivore: bool,
    pub carnivore: bool,
    pub common_domestic: bool,
    pub cookable_live: bool,
    pub demon: bool,
    pub die_when_vermin_bite: bool,
    pub equips: bool,
    pub extravision: bool,
    pub feature_beast: bool,
    pub female: bool,
    pub fire_immune: bool,
    pub fire_immune_super: bool,
    pub fish_item: bool,
    pub flier: bool,
    pub gnawer: bool,
    pub has_nerves: bool,
    pub hunts_vermin: bool,
    pub immobile: bool,
    pub immobile_land: bool,
    pub immolate: bool,
    pub intelligent: bool,
    pub large_predator: bool,
    pub lays_eggs: bool,
    pub light_gen: bool,
    pub lock_picker: bool,
    pub magma_vision: bool,
    pub male: bool,
    pub meanderer: bool,
    pub megabeast: bool,
    pub mischievous: bool,
    pub mount: bool,
    pub mount_exotic: bool,
    pub multipart_full_vision: bool,
    pub multiple_litter_rare: bool,
    pub natural: bool,
    pub no_connections_for_movement: bool,
    pub no_dizziness: bool,
    pub no_drink: bool,
    pub no_eat: bool,
    pub no_fevers: bool,
    pub no_gender: bool,
    pub no_sleep: bool,
    pub no_bones: bool,
    pub no_breathe: bool,
    pub no_emotion: bool,
    pub no_exert: bool,
    pub no_fear: bool,
    pub no_meat: bool,
    pub no_nausea: bool,
    pub no_pain: bool,
    pub no_skin: bool,
    pub no_skull: bool,
    pub no_smelly_rot: bool,
    pub no_stuck_ins: bool,
    pub no_stun: bool,
    pub not_butcherable: bool,
    pub not_living: bool,
    pub no_thought: bool,
    pub opposed_to_life: bool,
    pub outsider_controllable: bool,
    pub pack_animal: bool,
    pub paralyzeimmune: bool,
    pub pet: bool,
    pub pet_exotic: bool,
    pub power: bool,
    pub semi_megabeast: bool,
    pub slow_learner: bool,
    pub small_remains: bool,
    pub standard_grazer: bool, //Acts as [GRAZER] but set to 20000*G*(max size)^(-3/4)
    pub supernatural: bool,
    pub swims_innate: bool,
    pub swims_learned: bool,
    pub thick_web: bool,
    pub titan: bool,
    pub trances: bool,
    pub trap_avoid: bool,
    pub unique_demon: bool,
    pub vegetation: bool,
    pub vermin_hateable: bool,
    pub vermin_micro: bool,
    pub vermin_no_fish: bool,
    pub vermin_no_roam: bool,
    pub vermin_no_trap: bool,
    pub wagon_puller: bool,
    pub web_immune: bool,

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
    pub body_size: Vec<DFBodySize>,
    pub milkable: DFMilkable,
}

// active time:
//      diurnal & nocturnal & crepuscular & matutinal & vespertine = 31
pub static ACTIVE_DIURNAL: u8 = 1;
pub static ACTIVE_NOCTURNAL: u8 = 2;
pub static ACTIVE_CREPUSCULAR: u8 = 4;
pub static ACTIVE_MATUTINAL: u8 = 8;
pub static ACTIVE_VESPERTINE: u8 = 16;

// curious beast:
//      eater & guzzler & item = 7
pub static CURIOUS_EATER: u8 = 1;
pub static CURIOUS_GUZZLER: u8 = 2;
pub static CURIOUS_ITEM: u8 = 4;

// "no" season (creature does not appear):
//      NO_SPRING & NO_SUMMER & NO_AUTUMN & NO_WINTER = 15
pub static NO_SPRING: u8 = 1;
pub static NO_SUMMER: u8 = 2;
pub static NO_FALL: u8 = 4;
pub static NO_WINTER: u8 = 8;

// trainable:
//      war & hunting = 3
pub static TRAINABLE_HUNTING: u8 = 1;
pub static TRAINABLE_WAR: u8 = 2;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFBodySize {
    years: u32,
    days: u32,
    size_cm3: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DFMilkable {
    material: String,
    frequency: u32,
}

impl DFCreature {
    pub fn new(raw: &str, id: &str) -> Self {
        Self {
            identifier: String::from(id),
            parent_raw: String::from(raw),
            object_id: format!("{}-{}-{}", raw, "CREATURE", slugify(id)),
            // Boolean Flags
            artificial_hiveable: false,
            does_not_exist: false,
            evil: false,
            fanciful: false,
            generated: false,
            good: false,
            large_roaming: false,
            local_pops_controllable: false,
            local_pops_produce_heroes: false,
            loose_clusters: false,
            mundane: false,
            savage: false,
            ubiquitous: false,
            vermin_eater: false,
            vermin_fish: false,
            vermin_grounder: false,
            vermin_rotter: false,
            vermin_soil: false,
            vermin_soil_colony: false,

            // integers
            frequency: 50, //Defaults to 50 if not specified

            // [min, max] ranges
            cluster_number: [1, 1],    //Defaults to 1:1 if not specified.
            population_number: [1, 1], //default 1:1

            // strings
            general_baby_name: SingPlurName::new(String::new()),
            general_child_name: SingPlurName::new(String::new()),
            name: Name::new(String::new()),

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
    pub fn get_all_names(&self) -> Vec<String> {
        let mut names: Vec<String> = Vec::new();
        names.append(&mut self.name.to_string_vec());
        names.append(&mut self.general_baby_name.to_string_vec());
        names.append(&mut self.general_child_name.to_string_vec());
        for self_caste in &self.castes {
            names.append(&mut self_caste.baby_name.to_string_vec());
            names.append(&mut self_caste.child_name.to_string_vec());
        }
        names.retain(|s| s != "");
        names.sort_unstable();
        names.dedup();
        names
    }
    pub fn get_description(&self) -> String {
        let mut descriptions: Vec<String> = Vec::new();
        for self_caste in &self.castes {
            descriptions.push(String::from(&self_caste.description));
        }
        descriptions.join(" ")
    }
    pub fn get_max_ages(&self) -> HashMap<String, [u16; 2]> {
        let mut max_ages: HashMap<String, [u16; 2]> = HashMap::new();
        for self_caste in &self.castes {
            if self_caste.max_age[0] != self_caste.max_age[1] && self_caste.max_age[1] != 0 {
                max_ages.insert(String::from(&self_caste.name), self_caste.max_age);
            }
        }
        max_ages
    }
    pub fn get_clutch_sizes(&self) -> HashMap<String, [u16; 2]> {
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
    pub fn lays_eggs(&self) -> bool {
        for self_caste in &self.castes {
            if self_caste.lays_eggs {
                return true;
            }
        }
        false
    }
}

impl DFCreatureCaste {
    pub fn new(name: &str) -> Self {
        Self {
            // Identification
            name: String::from(name),
            // Boolean Flags
            adopts_owner: false,
            ambush_predator: false,
            amphibious: false,
            aquatic: false,
            arena_restricted: false,
            at_peace_with_wildlife: false,
            benign: false,
            bone_carnivore: false,
            carnivore: false,
            common_domestic: false,
            cookable_live: false,
            demon: false,
            die_when_vermin_bite: false,
            equips: false,
            extravision: false,
            feature_beast: false,
            female: false,
            fire_immune: false,
            fire_immune_super: false,
            fish_item: false,
            flier: false,
            gnawer: false,
            has_nerves: false,
            hunts_vermin: false,
            immobile: false,
            immobile_land: false,
            immolate: false,
            intelligent: false,
            large_predator: false,
            lays_eggs: false,
            light_gen: false,
            lock_picker: false,
            magma_vision: false,
            male: false,
            meanderer: false,
            megabeast: false,
            mischievous: false,
            mount: false,
            mount_exotic: false,
            multipart_full_vision: false,
            multiple_litter_rare: false,
            natural: false,
            no_connections_for_movement: false,
            no_dizziness: false,
            no_drink: false,
            no_eat: false,
            no_fevers: false,
            no_gender: false,
            no_sleep: false,
            no_bones: false,
            no_breathe: false,
            no_emotion: false,
            no_exert: false,
            no_fear: false,
            no_meat: false,
            no_nausea: false,
            no_pain: false,
            no_skin: false,
            no_skull: false,
            no_smelly_rot: false,
            no_stuck_ins: false,
            no_stun: false,
            not_butcherable: false,
            not_living: false,
            no_thought: false,
            opposed_to_life: false,
            outsider_controllable: false,
            pack_animal: false,
            paralyzeimmune: false,
            pet: false,
            pet_exotic: false,
            power: false,
            semi_megabeast: false,
            slow_learner: false,
            small_remains: false,
            standard_grazer: false, //Acts as [GRAZER] but set to 20000*G*(max size)^(-3/4)
            supernatural: false,
            swims_innate: false,
            swims_learned: false,
            thick_web: false,
            titan: false,
            trances: false,
            trap_avoid: false,
            unique_demon: false,
            vegetation: false,
            vermin_hateable: false,
            vermin_micro: false,
            vermin_no_fish: false,
            vermin_no_roam: false,
            vermin_no_trap: false,
            wagon_puller: false,
            web_immune: false,

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
            baby_name: SingPlurName::new(String::new()),
            caste_name: Name::new(String::new()),
            child_name: SingPlurName::new(String::new()),
            description: String::new(),

            // listicles
            creature_class: Vec::new(),

            // Custom tokens
            body_size: Vec::new(),
            milkable: DFMilkable::new("", 0),
        }
    }
}

impl DFMilkable {
    pub fn new(material: &str, frequency: u32) -> Self {
        Self {
            material: String::from(material),
            frequency: frequency,
        }
    }
}

impl DFBodySize {
    pub fn new(years: u32, days: u32, size_cm3: u32) -> Self {
        Self {
            years: years,
            days: days,
            size_cm3: size_cm3,
        }
    }
}
