use encoding_rs_io::DecodeReaderBytesBuilder;
use regex::Regex;
use slug::slugify;
use std::fs::File;
use std::io::{BufRead, BufReader};

use super::raws::{biomes, creature, names};

enum RawObjectKind {
    Creature,
    None,
}

pub fn parse_file(input_path: String) -> Vec<creature::DFCreature> {
    let re = Regex::new(r"(\[(?P<key>[^\[:]+):?(?P<value>[^\]\[]*)])").unwrap();
    let enc = encoding_rs::Encoding::for_label("latin1".as_bytes());

    let file = File::open(&input_path).unwrap();
    let decoding_reader = DecodeReaderBytesBuilder::new().encoding(enc).build(file);
    let reader = BufReader::new(decoding_reader);

    // let mut creatures = 0;
    let mut raw_filename = String::new();
    let mut current_object = RawObjectKind::None;
    let mut started = false;
    let mut creature_temp = creature::DFCreature::new("None", "None");
    let mut empty_caste = creature::DFCreatureCaste::new("none");
    let mut caste_temp = &mut empty_caste;

    let mut results: Vec<creature::DFCreature> = Vec::new();

    for (index, line) in reader.lines().enumerate() {
        if line.is_err() {
            eprintln!("Error processing {}:{}", &input_path, index);
            continue;
        }
        let line = line.unwrap();
        if index == 0 {
            raw_filename = String::from(&line);
            continue;
        }
        for cap in re.captures_iter(&line) {
            // println!("Key: {} Value: {}", &cap[2], &cap[3])
            match &cap[2] {
                "OBJECT" => match &cap[3] {
                    "CREATURE" => {
                        // println!("Discovered raws for creatures.");
                        current_object = RawObjectKind::Creature;
                    }
                    &_ => {
                        println!("No support right now for OBJECT:{}", &cap[3]);
                        return results;
                        // current_object = RawObjectKind::None;
                    }
                },
                "CREATURE" => {
                    // We are starting a creature object capture
                    match current_object {
                        RawObjectKind::Creature => {
                            if started {
                                // If we already *were* capturing a creature, export it.
                                // Reset the temp values !!Todo
                                //println!("{:#?}", creature_temp);
                                // writeln!(stream, "{},", to_string(&creature_temp).unwrap())
                                //  .expect("Unable to write creature info to out.json.");
                                results.push(creature_temp);
                            } else {
                                started = true;
                            }
                            creature_temp = creature::DFCreature::new(&raw_filename, &cap[3]);
                            creature_temp
                                .castes
                                .push(creature::DFCreatureCaste::new("EVERY"));
                            caste_temp = creature_temp.castes.last_mut().unwrap();
                        }
                        RawObjectKind::None => (),
                    }
                }
                "BIOME" => match biomes::BIOMES.get(&cap[3]) {
                    Some(biome_name) => creature_temp.biomes.push(biome_name.to_string()),
                    None => println!("{} is not in biome dictionary!", &cap[3]),
                },
                "BODY_SIZE" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    match split.len() {
                        3 => caste_temp.body_size.push(creature::DFBodySize::new(
                            split[0].parse().expect("Bad year argument for body size"),
                            split[1].parse().expect("Bad days argument for body size"),
                            split[2].parse().expect("Bad size argument for body size"),
                        )),
                        _ => (),
                    }
                }
                "MILKABLE" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    match split.len() {
                        3 => {
                            caste_temp.milkable = creature::DFMilkable::new(
                                &format!("{}:{}", split[0], split[1]),
                                split[2]
                                    .parse()
                                    .expect("Bad frequency argument for milkable"),
                            )
                        }

                        _ => (),
                    }
                }
                "PREFSTRING" => {
                    creature_temp.pref_string.push(String::from(&cap[3]));
                }
                "CREATURE_CLASS" => {
                    caste_temp.creature_class.push(String::from(&cap[3]));
                }
                "NAME" => {
                    creature_temp.name = names::Name::new(String::from(&cap[3]));
                }
                "CASTE" => {
                    creature_temp
                        .castes
                        .push(creature::DFCreatureCaste::new(&cap[3]));
                    caste_temp = creature_temp.castes.last_mut().unwrap();
                }
                "CASTE_NAME" => {
                    caste_temp.caste_name = names::Name::new(String::from(&cap[3]));
                }
                "GENERAL_BABY_NAME" => {
                    creature_temp.general_baby_name =
                        names::SingPlurName::new(String::from(&cap[3]));
                }
                "GENERAL_CHILD_NAME" => {
                    creature_temp.general_child_name =
                        names::SingPlurName::new(String::from(&cap[3]));
                }
                "LAYS_EGGS" => {
                    caste_temp.lays_eggs = true;
                }
                "EGG_SIZE" => {
                    caste_temp.egg_size = cap[3].parse().expect("EGG_SIZE should be an integer");
                }
                "BABY" => {
                    caste_temp.baby = cap[3].parse().expect("BABY should be an integer");
                }
                "CHILD" => {
                    caste_temp.child = cap[3].parse().expect("CHILD should be an integer");
                }
                "DIFFICULTY" => {
                    caste_temp.difficulty =
                        cap[3].parse().expect("DIFFICULTY should be an integer");
                }
                "GRASSTRAMPLE" => {
                    caste_temp.grass_trample =
                        cap[3].parse().expect("GRASSTRAMPLE should be an integer");
                }
                "GRAZER" => {
                    caste_temp.grazer = cap[3].parse().expect("GRAZER should be an integer");
                }
                "LOW_LIGHT_VISION" => {
                    caste_temp.low_light_vision = cap[3]
                        .parse()
                        .expect("LOW_LIGHT_VISION should be an integer");
                }
                "PETVALUE" => {
                    caste_temp.pet_value = cap[3].parse().expect("PETVALUE should be an integer");
                }
                "POP_RATIO" => {
                    caste_temp.pop_ratio = cap[3].parse().expect("POP_RATIO should be an integer");
                }
                "CLUTCH_SIZE" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    caste_temp.clutch_size[0] = split[0]
                        .parse()
                        .expect("CLUTCH_SIZE min should be an integer");
                    caste_temp.clutch_size[1] = split[1]
                        .parse()
                        .expect("CLUTCH_SIZE max should be an integer");
                }
                "LITTERSIZE" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    caste_temp.litter_size[0] = split[0]
                        .parse()
                        .expect("LITTERSIZE min should be an integer");
                    caste_temp.litter_size[1] = split[1]
                        .parse()
                        .expect("LITTERSIZE max should be an integer");
                }
                "DESCRIPTION" => {
                    caste_temp.description = String::from(&cap[3]);
                }
                "MAXAGE" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    caste_temp.max_age[0] =
                        split[0].parse().expect("MAXAGE min should be an integer");
                    caste_temp.max_age[1] =
                        split[1].parse().expect("MAXAGE max should be an integer");
                }
                "COPY_TAGS_FROM" => {
                    creature_temp.copy_tags_from.push(format!(
                        "{}-{}-{}",
                        raw_filename,
                        "CREATURE",
                        slugify(&cap[3])
                    ));
                }
                "ALL_ACTIVE" => {
                    caste_temp.active_time = caste_temp.active_time
                        | creature::ACTIVE_DIURNAL
                        | creature::ACTIVE_NOCTURNAL
                        | creature::ACTIVE_CREPUSCULAR;
                }
                "DIURNAL" => {
                    caste_temp.active_time = caste_temp.active_time | creature::ACTIVE_DIURNAL;
                }
                "CREPUSCULAR" => {
                    caste_temp.active_time = caste_temp.active_time | creature::ACTIVE_CREPUSCULAR;
                }
                "MATUTINAL" => {
                    caste_temp.active_time = caste_temp.active_time | creature::ACTIVE_MATUTINAL;
                }
                "VESPERTINE" => {
                    caste_temp.active_time = caste_temp.active_time | creature::ACTIVE_VESPERTINE;
                }
                "NOCTURNAL" => {
                    caste_temp.active_time = caste_temp.active_time | creature::ACTIVE_NOCTURNAL;
                }
                "AMBUSHPREDATOR" => {
                    caste_temp.ambush_predator = true;
                }
                "AMPHIBIOUS" => {
                    caste_temp.amphibious = true;
                }
                "CURIOUSBEAST_EATER" => {
                    caste_temp.curious_beast = caste_temp.curious_beast | creature::CURIOUS_EATER;
                }
                "CURIOUSBEAST_GUZZLER" => {
                    caste_temp.curious_beast = caste_temp.curious_beast | creature::CURIOUS_GUZZLER;
                }
                "CURIOUSBEAST_ITEM" => {
                    caste_temp.curious_beast = caste_temp.curious_beast | creature::CURIOUS_ITEM;
                }
                "NO_SPRING" => {
                    caste_temp.no_season = caste_temp.no_season | creature::NO_SPRING;
                }
                "NO_SUMMER" => {
                    caste_temp.no_season = caste_temp.no_season | creature::NO_SUMMER;
                }
                "NO_AUTUMN" => {
                    caste_temp.no_season = caste_temp.no_season | creature::NO_FALL;
                }
                "NO_WINTER" => {
                    caste_temp.no_season = caste_temp.no_season | creature::NO_WINTER;
                }
                "TRAINABLE_HUNTING" => {
                    caste_temp.trainable = caste_temp.trainable | creature::TRAINABLE_HUNTING;
                }
                "TRAINABLE_WAR" => {
                    caste_temp.trainable = caste_temp.trainable | creature::TRAINABLE_WAR;
                }
                "TRAINABLE" => {
                    caste_temp.trainable = caste_temp.trainable
                        | creature::TRAINABLE_WAR
                        | creature::TRAINABLE_HUNTING;
                }
                "ARTIFICIAL_HIVEABLE" => {
                    creature_temp.artificial_hiveable = true;
                }
                "CLUSTER_NUMBER" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    creature_temp.cluster_number[0] = split[0]
                        .parse()
                        .expect("CLUSTER_NUMBER min should be an integer");
                    creature_temp.cluster_number[1] = split[1]
                        .parse()
                        .expect("CLUSTER_NUMBER max should be an integer");
                }
                "POPULATION_NUMBER" => {
                    let split = cap[3].split(":").collect::<Vec<&str>>();
                    creature_temp.population_number[0] = split[0]
                        .parse()
                        .expect("POPULATION_NUMBER min should be an integer");
                    creature_temp.population_number[1] = split[1]
                        .parse()
                        .expect("POPULATION_NUMBER max should be an integer");
                }
                "DOES_NOT_EXIST" => {
                    creature_temp.does_not_exist = true;
                }
                "EVIL" => {
                    creature_temp.evil = true;
                }
                "FANCIFUL" => {
                    creature_temp.fanciful = true;
                }
                "GOOD" => {
                    creature_temp.good = true;
                }
                "SAVAGE" => {
                    creature_temp.savage = true;
                }
                "GENERATED" => {
                    creature_temp.generated = true;
                }
                "UBIQUITOUS" => {
                    creature_temp.ubiquitous = true;
                }
                "VERMIN_SOIL" => {
                    creature_temp.vermin_soil = true;
                }
                "VERMIN_SOIL_COLONY" => {
                    creature_temp.vermin_soil_colony = true;
                }
                "VERMIN_ROTTER" => {
                    creature_temp.vermin_rotter = true;
                }
                "VERMIN_GROUNDER" => {
                    creature_temp.vermin_grounder = true;
                }
                "VERMIN_FISH" => {
                    creature_temp.vermin_fish = true;
                }
                "VERMIN_EATER" => {
                    creature_temp.vermin_eater = true;
                }
                "FREQUENCY" => {
                    creature_temp.frequency =
                        cap[3].parse().expect("Frequency should be an integer");
                }
                "LARGE_ROAMING" => {
                    creature_temp.large_roaming = true;
                }
                "LOCAL_POPS_CONTROLLABLE" => {
                    creature_temp.local_pops_controllable = true;
                }
                "LOCAL_POPS_PRODUCE_HEROES" => {
                    creature_temp.local_pops_produce_heroes = true;
                }
                "LOOSE_CLUSTERS" => {
                    creature_temp.loose_clusters = true;
                }
                "ADOPTS_OWNER" => {
                    caste_temp.adopts_owner = true;
                }
                "AMBUSH_PREDATOR" => {
                    caste_temp.ambush_predator = true;
                }
                "BENIGN" => {
                    caste_temp.benign = true;
                }
                "AQUATIC" => {
                    caste_temp.aquatic = true;
                }
                "ARENA_RESTRICTED" => {
                    caste_temp.arena_restricted = true;
                }
                "AT_PEACE_WITH_WILDLIFE" => {
                    caste_temp.at_peace_with_wildlife = true;
                }
                "BONECARN" => {
                    caste_temp.bone_carnivore = true;
                    caste_temp.carnivore = true;
                }
                "CARNIVORE" => {
                    caste_temp.carnivore = true;
                }
                "COMMON_DOMESTIC" => {
                    caste_temp.common_domestic = true;
                }
                "COOKABLE_LIVE" => {
                    caste_temp.cookable_live = true;
                }
                "DEMON" => {
                    caste_temp.demon = true;
                }
                "DIE_WHEN_VERMIN_BITE" => {
                    caste_temp.die_when_vermin_bite = true;
                }
                "EQUIPS" => {
                    caste_temp.equips = true;
                }
                "EXTRAVISION" => {
                    caste_temp.extravision = true;
                }
                "FEATURE_BEAST" => {
                    caste_temp.feature_beast = true;
                }
                "FEMALE" => {
                    caste_temp.female = true;
                }
                "FIREIMMUNE" => {
                    caste_temp.fire_immune = true;
                }
                "FIREIMMUNE_SUPER" => {
                    caste_temp.fire_immune_super = true;
                }
                "FISHITEM" => {
                    caste_temp.fish_item = true;
                }
                "FLIER" => {
                    caste_temp.flier = true;
                }
                "GNAWER" => {
                    caste_temp.gnawer = true;
                }
                "HAS_NERVES" => {
                    caste_temp.has_nerves = true;
                }
                "HUNTS_VERMIN" => {
                    caste_temp.hunts_vermin = true;
                }
                "IMMOBILE" => {
                    caste_temp.immobile = true;
                }
                "IMMOBILE_LAND" => {
                    caste_temp.immobile_land = true;
                }
                "IMMOLATE" => {
                    caste_temp.immolate = true;
                }
                "INTELLIGENT" => {
                    caste_temp.intelligent = true;
                }
                "LIGHT_GEN" => {
                    caste_temp.light_gen = true;
                }
                "LOCKPICKER" => {
                    caste_temp.lock_picker = true;
                }
                "MAGMA_VISION" => {
                    caste_temp.magma_vision = true;
                }
                "MALE" => {
                    caste_temp.male = true;
                }
                "MEANDERER" => {
                    caste_temp.meanderer = true;
                }
                "MEGABEAST" => {
                    caste_temp.megabeast = true;
                }
                "MISCHIEVIOUS" => {
                    caste_temp.mischievous = true;
                }
                "MISCHIEVOUS" => {
                    caste_temp.mischievous = true;
                }
                "MOUNT" => {
                    caste_temp.mount = true;
                }
                "MOUNT_EXOTIC" => {
                    caste_temp.mount_exotic = true;
                }
                "MULTIPART_FULL_VISION" => {
                    caste_temp.multipart_full_vision = true;
                }
                "MULTIPLE_LITTER_RARE" => {
                    caste_temp.multiple_litter_rare = true;
                }
                "MUNDANE" => {
                    creature_temp.mundane = true;
                }
                "NATURAL" => {
                    caste_temp.natural = true;
                }
                "NO_CONNECTIONS_FOR_MOVEMENT" => {
                    caste_temp.no_connections_for_movement = true;
                }
                "NO_DIZZINESS" => {
                    caste_temp.no_dizziness = true;
                }
                "NO_DRINK" => {
                    caste_temp.no_drink = true;
                }
                "NO_EAT" => {
                    caste_temp.no_eat = true;
                }
                "NO_FEVERS" => {
                    caste_temp.no_fevers = true;
                }
                "NO_GENDER" => {
                    caste_temp.no_gender = true;
                }
                "NO_SLEEP" => {
                    caste_temp.no_sleep = true;
                }
                "NOBONES" => {
                    caste_temp.no_bones = true;
                }
                "NOBREATHE" => {
                    caste_temp.no_breathe = true;
                }
                "NOEMOTION" => {
                    caste_temp.no_emotion = true;
                }
                "NOEXERT" => {
                    caste_temp.no_exert = true;
                }
                "NOFEAR" => {
                    caste_temp.no_fear = true;
                }
                "NOMEAT" => {
                    caste_temp.no_meat = true;
                }
                "NONAUSEA" => {
                    caste_temp.no_nausea = true;
                }
                "NOPAIN" => {
                    caste_temp.no_pain = true;
                }
                "NOSKIN" => {
                    caste_temp.no_skin = true;
                }
                "NOSKULL" => {
                    caste_temp.no_skull = true;
                }
                "NOSMELLYROT" => {
                    caste_temp.no_smelly_rot = true;
                }
                "NOSTUCKINS" => {
                    caste_temp.no_stuck_ins = true;
                }
                "NOSTUN" => {
                    caste_temp.no_stun = true;
                }
                "NOT_BUTCHERABLE" => {
                    caste_temp.not_butcherable = true;
                }
                "NOT_LIVING" => {
                    caste_temp.not_living = true;
                }
                "NOTHOUGHT" => {
                    caste_temp.no_thought = true;
                }
                "OPPOSED_TO_LIFE" => {
                    caste_temp.opposed_to_life = true;
                }
                "OUTSIDER_CONTROLLABLE" => {
                    caste_temp.outsider_controllable = true;
                }
                "PACK_ANIMAL" => {
                    caste_temp.pack_animal = true;
                }
                "PARALYZEIMMUNE" => {
                    caste_temp.paralyzeimmune = true;
                }
                "PET" => {
                    caste_temp.pet = true;
                }
                "PET_EXOTIC" => {
                    caste_temp.pet_exotic = true;
                }
                "POWER" => {
                    caste_temp.power = true;
                }
                "SEMIMEGABEAST" => {
                    caste_temp.semi_megabeast = true;
                }
                "SLOW_LEARNER" => {
                    caste_temp.slow_learner = true;
                }
                "SMALL_REMAINS" => {
                    caste_temp.small_remains = true;
                }
                "STANDARD_GRAZER" => {
                    caste_temp.standard_grazer = true;
                }
                "SUPERNATURAL" => {
                    caste_temp.supernatural = true;
                }
                "SWIMS_INNATE" => {
                    caste_temp.swims_innate = true;
                }
                "SWIMS_LEARNED" => {
                    caste_temp.swims_learned = true;
                }
                "THICKWEB" => {
                    caste_temp.thick_web = true;
                }
                "TITAN" => {
                    caste_temp.titan = true;
                }
                "TRANCES" => {
                    caste_temp.trances = true;
                }
                "TRAPAVOID" => {
                    caste_temp.trap_avoid = true;
                }
                "UNIQUE_DEMON" => {
                    caste_temp.unique_demon = true;
                }
                "VEGETATION" => {
                    caste_temp.vegetation = true;
                }
                "VERMIN_HATEABLE" => {
                    caste_temp.vermin_hateable = true;
                }
                "VERMIN_MICRO" => {
                    caste_temp.vermin_micro = true;
                }
                "VERMIN_NOFISH" => {
                    caste_temp.vermin_no_fish = true;
                }
                "VERMIN_NOROAM" => {
                    caste_temp.vermin_no_roam = true;
                }
                "VERMIN_NOTRAP" => {
                    caste_temp.vermin_no_trap = true;
                }
                "WAGON_PULLER" => {
                    caste_temp.wagon_puller = true;
                }
                "WEBIMMUNE" => {
                    caste_temp.web_immune = true;
                }
                &_ => (),
            }
        }
    }
    match current_object {
        RawObjectKind::Creature => {
            // If we already *were* capturing a creature, export it.
            // println!("Finished capturing creature, now finished");
            // Reset the temp values !!Todo
            //println!("{:#?}", creature_temp);
            results.push(creature_temp);
        }
        RawObjectKind::None => (),
    }
    // println!("{} creatures defined in {}", creatures, &raw_filename);
    results
}
