use dfraw_json_parser::{
    biome::Token as Biome,
    creature::{Creature, Token as CreatureTag},
    creature_caste::Token as CreatureCasteTag,
    inorganic::{Inorganic, Token as InorganicTag},
    plant::{Plant, Token as PlantTag},
    ObjectType, RawModuleLocation, RawObject,
};
use serde::{Deserialize, Serialize};
use specta::Type;
use tracing::warn;

#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
/// A filter that can be applied to a search. This is to allow tags to be required or optional,
/// but at least specified for each type of object with tags.
///
/// # Variants
///
/// * `Creature` - A creature token filter. This will imply that the object must be a creature.
/// * `CreatureCaste` - A creature caste token filter. This will imply that the object must be a creature.
/// * `Inorganic` - An inorganic token filter. This will imply that the object must be an inorganic.
/// * `Object` - Filter for a specific object type. Include multiple filters for multiple object types.
/// * `Biome` - Filter objects that exist in specific biomes. Include multiple filters for multiple biomes.
/// * `Module` - Filter objects that exist in a specific module (by module id). This cannot work for multiple modules (i.e. it implies an OR condition for multiple modules).
/// * `Location` - Filter objects that exist in specific locations. This cannot work for multiple locations (i.e. it implies an OR condition for multiple locations).
/// * `None` - A dummy filter. This will not match any objects.
pub enum Filter {
    /// A creature token filter
    Creature(CreatureTag),
    /// A creature caste token filter
    CreatureCaste(CreatureCasteTag),
    /// An inorganic token filter
    Inorganic(InorganicTag),
    /// A plant token filter
    Plant(PlantTag),
    /// Filter for a specific object type
    Object(ObjectType),
    /// Filter objects that exist in specific biomes
    Biome(Biome),
    /// Filter objects that exist in specific modules
    Module(String),
    /// Filter objects that exist in specific locations
    Location(RawModuleLocation),
    /// Filter objects that match part of the search query
    SearchQuery(String),
    /// Filter specifically by part of the identifier of the raw object
    Identifier(String),
    #[default]
    /// A dummy filter
    None,
}

impl Filter {
    /// Check if the object type is allowed by this filter. This is a helper function to determine if the object type is allowed by this filter.
    /// It is a shortcut to avoid heavy matching on the filter type.
    ///
    /// # Arguments
    ///
    /// * `object_type` - The object type to check against.
    ///
    /// # Returns
    ///
    /// Whether the object type is allowed by this filter.
    #[must_use]
    pub fn allowed_object_type(&self, object_type: &ObjectType) -> bool {
        match self {
            Filter::Creature(_) | Filter::CreatureCaste(_) => {
                matches!(object_type, ObjectType::Creature)
            }
            Filter::Inorganic(_) => matches!(object_type, ObjectType::Inorganic),
            Filter::Plant(_) => matches!(object_type, ObjectType::Plant),
            Filter::Object(filter_object_type) => object_type == filter_object_type,
            Filter::Biome(_) => matches!(object_type, ObjectType::Creature | ObjectType::Plant),
            Filter::Module(_)
            | Filter::Location(_)
            | Filter::SearchQuery(_)
            | Filter::Identifier(_) => true,
            Filter::None => false,
        }
    }
    /// Returns whether the given raw object is allowed by this filter.
    ///
    /// # Arguments
    ///
    /// * `raw_object` - The raw object to check against.
    ///
    /// # Returns
    ///
    /// Whether the given raw object is allowed by this filter.
    #[allow(clippy::borrowed_box)]
    pub fn allow(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if !self.allowed_object_type(raw_object.get_type()) {
            return false;
        }

        match self {
            Filter::Creature(creature_token) => creature_token.within(raw_object),
            Filter::CreatureCaste(creature_caste_token) => creature_caste_token.within(raw_object),
            Filter::Inorganic(inorganic_token) => inorganic_token.within(raw_object),
            Filter::Plant(plant_token) => plant_token.within(raw_object),
            Filter::Object(object_type) => object_type == raw_object.get_type(),
            Filter::Biome(biome) => match raw_object.get_type() {
                ObjectType::Creature => {
                    if let Some(creature) = raw_object.as_any().downcast_ref::<Creature>() {
                        creature.has_biome(biome)
                    } else {
                        warn!(
                            "Failed to downcast raw object to creature {}",
                            raw_object.get_object_id()
                        );
                        false
                    }
                }
                ObjectType::Plant => {
                    if let Some(plant) = raw_object.as_any().downcast_ref::<Plant>() {
                        plant.has_biome(biome)
                    } else {
                        warn!(
                            "Failed to downcast raw object to plant {}",
                            raw_object.get_object_id()
                        );
                        false
                    }
                }
                _ => false,
            },
            Filter::Module(module_id) => {
                raw_object.get_metadata().get_module_object_id() == module_id
            }
            Filter::Location(location) => raw_object.get_metadata().get_location() == location,
            Filter::SearchQuery(query) => raw_object
                .get_search_vec()
                .iter()
                .any(|search| search.contains(query)),
            Filter::Identifier(identifier) => raw_object.get_identifier().contains(identifier),
            Filter::None => false,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
/// A filter that can be applied to a search. Multiple `SearchFilter`s can be combined to create complex search queries.
///
/// # Fields
///
/// * `required` - Whether the filter is required (or just optional) to be part of an object for a result to be included.
/// Using this, you can specify that the filter array is connected by an `AND` or an `OR`.
/// * `filter` - A list of filters that must resolve to true for the object to be included in the search results.
pub struct SearchFilter {
    /// Whether the filter is required (or just optional) to be part of an object
    pub required: bool,
    /// Whether the filter is inverted (i.e. the object must not match the filter)
    pub inverted: bool,
    /// The filter to check against.
    pub filters: Vec<Filter>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_allowed_object_type() {
        let filter = Filter::Creature(CreatureTag::Dwarf);
        let object_type = ObjectType::Creature;
        assert!(filter.allowed_object_type(&object_type));

        let filter = Filter::Inorganic(InorganicTag::Gold);
        let object_type = ObjectType::Inorganic;
        assert!(filter.allowed_object_type(&object_type));

        let filter = Filter::Biome(Biome::Ocean);
        let object_type = ObjectType::Creature;
        assert!(filter.allowed_object_type(&object_type));

        let filter = Filter::Object(ObjectType::Building);
        let object_type = ObjectType::Building;
        assert!(filter.allowed_object_type(&object_type));

        let filter = Filter::None;
        let object_type = ObjectType::Creature;
        assert!(!filter.allowed_object_type(&object_type));
    }

    #[test]
    fn test_allow() {
        let raw_object: Box<dyn RawObject> = Box::new(Creature::new());
        let filter = Filter::Creature(CreatureTag::Dwarf);
        assert!(filter.allow(&raw_object));

        let raw_object: Box<dyn RawObject> = Box::new(Inorganic::new());
        let filter = Filter::Inorganic(InorganicTag::Gold);
        assert!(filter.allow(&raw_object));

        let raw_object: Box<dyn RawObject> = Box::new(Creature::new());
        let filter = Filter::Biome(Biome::Ocean);
        assert!(filter.allow(&raw_object));

        let raw_object: Box<dyn RawObject> = Box::new(Building::new());
        let filter = Filter::Object(ObjectType::Building);
        assert!(filter.allow(&raw_object));

        let raw_object: Box<dyn RawObject> = Box::new(Creature::new());
        let filter = Filter::None;
        assert!(!filter.allow(&raw_object));
    }

    #[test]
    fn test_add_filter() {
        let mut search_filter = SearchFilter::default();
        let filter = Filter::Creature(CreatureTag::Dwarf);
        search_filter.add_filter(filter.clone());
        assert_eq!(search_filter.filters.len(), 1);
        assert_eq!(search_filter.filters[0], filter);
    }

    #[test]
    fn test_optional() {
        let mut search_filter = SearchFilter::default();
        search_filter.optional();
        assert!(!search_filter.required);
    }

    #[test]
    fn test_required() {
        let mut search_filter = SearchFilter::default();
        search_filter.required();
        assert!(search_filter.required);
    }

    #[test]
    fn test_is_optional() {
        let search_filter = SearchFilter {
            required: false,
            inverted: false,
            filters: vec![],
        };
        assert!(search_filter.is_optional());
    }

    #[test]
    fn test_is_required() {
        let search_filter = SearchFilter {
            required: true,
            inverted: false,
            filters: vec![],
        };
        assert!(search_filter.is_required());
    }

    #[test]
    fn test_for_object_type() {
        let search_filter = SearchFilter {
            required: true,
            inverted: false,
            filters: vec![
                Filter::Creature(CreatureTag::Dwarf),
                Filter::Object(ObjectType::Building),
                Filter::Biome(Biome::Ocean),
            ],
        };

        let object_type = ObjectType::Creature;
        let expected_filters = vec![&Filter::Creature(CreatureTag::Dwarf)];
        assert_eq!(search_filter.for_object_type(&object_type), expected_filters);

        let object_type = ObjectType::Building;
        let expected_filters = vec![&Filter::Object(ObjectType::Building)];
        assert_eq!(search_filter.for_object_type(&object_type), expected_filters);

        let object_type = ObjectType::Inorganic;
        let expected_filters = vec![];
        assert_eq!(search_filter.for_object_type(&object_type), expected_filters);
    }

    #[test]
    fn test_allow_search_filter() {
        let raw_object: Box<dyn RawObject> = Box::new(Creature::new());
        let filter1 = Filter::Creature(CreatureTag::Dwarf);
        let filter2 = Filter::Biome(Biome::Ocean);
        let mut search_filter = SearchFilter::default();
        search_filter.add_filter(filter1.clone());
        search_filter.add_filter(filter2.clone());

        assert!(search_filter.allow(&raw_object));

        let raw_object: Box<dyn RawObject> = Box::new(Creature::new());
        let filter1 = Filter::Creature(CreatureTag::Elf);
        let filter2 = Filter::Biome(Biome::Ocean);
        let mut search_filter = SearchFilter::default();
        search_filter.add_filter(filter1.clone());
        search_filter.add_filter(filter2.clone());

        assert!(!search_filter.allow(&raw_object));
    }
}

trait FilterableToken {
    #[allow(clippy::borrowed_box)]
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool;
}

impl FilterableToken for CreatureTag {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(creature) = raw_object.as_any().downcast_ref::<Creature>() {
            // Check if the creature has the token
            creature.has_tag(self)
        } else {
            warn!(
                "Failed to downcast raw object to creature {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
impl FilterableToken for CreatureCasteTag {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(creature) = raw_object.as_any().downcast_ref::<Creature>() {
            creature.has_caste_tag(self)
        } else {
            warn!(
                "Failed to downcast raw object to creature {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
impl FilterableToken for InorganicTag {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(inorganic) = raw_object.as_any().downcast_ref::<Inorganic>() {
            inorganic.has_tag(self)
        } else {
            warn!(
                "Failed to downcast raw object to inorganic {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
impl FilterableToken for PlantTag {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(plant) = raw_object.as_any().downcast_ref::<Plant>() {
            plant.has_tag(self)
        } else {
            warn!(
                "Failed to downcast raw object to plant {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
