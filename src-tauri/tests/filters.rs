use app_lib::search_handler::filtering::*;
use dfraw_json_parser::metadata::{ObjectType, RawModuleLocation};
use dfraw_json_parser::tags::BiomeTag;
use dfraw_json_parser::tags::CasteTag;
use dfraw_json_parser::tags::CreatureTag;
use dfraw_json_parser::tags::InorganicTag;
use dfraw_json_parser::tags::PlantTag;

#[test]
fn test_allowed_object_type() {
    let filter = Filter::Creature(CreatureTag::Evil);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::CreatureCaste(CasteTag::AlcoholDependent);
    let object_type = ObjectType::Creature;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Plant(PlantTag::Savage);
    let object_type = ObjectType::Plant;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Inorganic(InorganicTag::Sedimentary);
    let object_type = ObjectType::Inorganic;
    assert!(filter.allowed_object_type(&object_type));

    let filter = Filter::Biome(BiomeTag::AnyDesert);
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
