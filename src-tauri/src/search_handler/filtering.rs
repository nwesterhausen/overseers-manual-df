use dfraw_json_parser::creature::Creature;
use dfraw_json_parser::creature_caste::Token as CreatureCasteToken;
use dfraw_json_parser::inorganic::{Inorganic, Token as InorganicToken};
use dfraw_json_parser::ObjectType;
use dfraw_json_parser::{creature::Token as CreatureToken, RawObject};
use serde::{Deserialize, Serialize};
use tracing::{debug, warn};

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
/// A filter that can be applied to a search. This is to allow tags to be required or optional,
/// but at least specified for each type of object with tags.
pub enum Filter {
    /// A creature token filter
    Creature(CreatureToken),
    /// A creature caste token filter
    CreatureCaste(CreatureCasteToken),
    /// An inorganic token filter
    Inorganic(InorganicToken),
    #[default]
    /// A dummy filter
    None,
}

impl Filter {
    pub fn get_object_type(&self) -> ObjectType {
        match self {
            Filter::Creature(_) => ObjectType::Creature,
            Filter::CreatureCaste(_) => ObjectType::Creature,
            Filter::Inorganic(_) => ObjectType::Inorganic,
            Filter::None => ObjectType::Unknown,
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
    pub fn allow(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if self.get_object_type() != *raw_object.get_type() {
            return false;
        }

        match self {
            Filter::Creature(creature_token) => creature_token.within(raw_object),
            Filter::CreatureCaste(creature_caste_token) => creature_caste_token.within(raw_object),
            Filter::Inorganic(inorganic_token) => inorganic_token.within(raw_object),
            Filter::None => false,
        }
    }
}

#[derive(ts_rs::TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::module_name_repetitions)]
/// A filter that can be applied to a search.
///
/// # Fields
///
/// * `required` - Whether the filter is required (or just optional) to be part of an object
/// for a result to be included.
/// * `filter` - The filter to check against.
pub struct SearchFilter {
    /// Whether the filter is required (or just optional) to be part of an object
    pub required: bool,
    /// The filter to check against.
    pub filters: Vec<Filter>,
}

impl SearchFilter {
    /// Add a filter to the search filter.
    pub fn add_filter(&mut self, filter: Filter) -> &mut Self {
        // Reject the dummy filter
        if matches!(filter, Filter::None) {
            return self;
        }
        self.filters.push(filter);
        self
    }

    /// Sets the filter to be optional.
    pub fn optional(&mut self) -> &mut Self {
        self.required = false;
        self
    }

    /// Sets the filter to be required.
    pub fn required(&mut self) -> &mut Self {
        self.required = true;
        self
    }

    /// Returns whether the filter is optional.
    pub fn is_optional(&self) -> bool {
        !self.required
    }

    /// Returns whether the filter is required.
    pub fn is_required(&self) -> bool {
        self.required
    }

    /// Returns a filtered list of filters by the given object type.
    ///
    /// # Arguments
    ///
    /// * `object_type` - The object type to filter by.
    ///
    /// # Returns
    ///
    /// A list of filters that match the given object type.
    pub fn for_object_type(&self, object_type: &ObjectType) -> Vec<&Filter> {
        self.filters
            .iter()
            .filter(|filter| match filter {
                Filter::Creature(_) => matches!(object_type, ObjectType::Creature),
                Filter::CreatureCaste(_) => matches!(object_type, ObjectType::CreatureCaste),
                Filter::Inorganic(_) => matches!(object_type, ObjectType::Inorganic),
                Filter::None => false,
            })
            .collect()
    }
}

trait FilterableToken {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool;
}

impl FilterableToken for CreatureToken {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(creature) = raw_object.as_any().downcast_ref::<Creature>() {
            // Match the tag and if it defines a property, we can check if the property is not the default
            // value. If tag falls through, just check it against the creature's tags.
            match self {
                CreatureToken::DoesNotExist => return creature.does_not_exist(),
                _ => false,
            }
        } else {
            warn!(
                "Failed to downcast raw object to creature {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
impl FilterableToken for CreatureCasteToken {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(creature) = raw_object.as_any().downcast_ref::<Creature>() {
            false
        } else {
            warn!(
                "Failed to downcast raw object to creature {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
impl FilterableToken for InorganicToken {
    fn within(&self, raw_object: &Box<dyn RawObject>) -> bool {
        if let Some(inorganic) = raw_object.as_any().downcast_ref::<Inorganic>() {
            false
        } else {
            warn!(
                "Failed to downcast raw object to inorganic {}",
                raw_object.get_object_id()
            );
            false
        }
    }
}
