use dfraw_json_parser::creature::Token as CreatureToken;
use dfraw_json_parser::creature_caste::Token as CreatureCasteToken;
use dfraw_json_parser::inorganic::Token as InorganicToken;
use dfraw_json_parser::ObjectType;
use serde::{Deserialize, Serialize};

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
