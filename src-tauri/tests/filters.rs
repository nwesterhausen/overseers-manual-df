use app_lib::search_handler::filtering::*;
use dfraw_json_parser::biome::Token as Biome;
use dfraw_json_parser::creature::Token as CreatureTag;
use dfraw_json_parser::creature_caste::Token as CreatureCasteTag;
use dfraw_json_parser::inorganic::Token as InorganicTag;
use dfraw_json_parser::plant::Token as PlantTag;
use dfraw_json_parser::{ObjectType, RawModuleLocation};

#[test]
fn test_allowed_object_type() {
    let filter = Filter::Creature(CreatureTag::Evil);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::CreatureCaste(CreatureCasteTag::AlcoholDependent);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Plant(PlantTag::Savage);
    let object_type = ObjectType::Plant;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Inorganic(InorganicTag::Sedimentary);
    let object_type = ObjectType::Inorganic;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Biome(Biome::AnyDesert);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::Plant;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Object(ObjectType::Building);
    let object_type = ObjectType::Building;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::TilePage;
    assert!(!filter.allowed_object_type(&object_type));

    let filter = Filter::Location(RawModuleLocation::Vanilla);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::Plant;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::TilePage;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Module("test_module".to_string());
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::Plant;
    assert!(filter.allowed_object_type(&object_type));
    let object_type = ObjectType::Graphics;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::None;
    let object_type = ObjectType::Creature;
    assert!(!filter.allowed_object_type(&object_type));
}
