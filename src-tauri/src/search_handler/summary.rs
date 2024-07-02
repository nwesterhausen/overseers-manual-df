use dfraw_json_parser::metadata::{ObjectType, RawModuleLocation};
use dfraw_json_parser::traits::RawObject;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::time::Duration;

#[derive(Debug, Default, Clone, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
/// A summary of the parsing process.
pub struct Summary {
    /// The total number of raws parsed.
    pub total_raws: usize,
    /// The number of raws of each type.
    pub counts: Vec<(ObjectType, usize)>,
    /// The number of raws of each location.
    pub location_totals: Vec<(RawModuleLocation, usize)>,
    /// The duration of the parsing process.
    pub parsing_duration: String,
    /// The duration of the saving all raws to the store.
    pub save_to_store_duration: String,
    /// The duration of the filtering process, which includes these steps:
    ///
    /// - Making search lookup
    /// - Putting all graphics in the graphic store
    /// - Putting all tile pages in the tile page store
    pub filtering_duration: String,
    /// The object types that were allowed.
    pub objects_allowed: Vec<ObjectType>,
    /// The locations that were allowed.
    pub locations: Vec<RawModuleLocation>,
}

impl Summary {
    /// Creates a new summary from the results of the parsing process.
    ///
    /// # Arguments
    ///
    /// * `total_raws` - All the parsed raws.
    /// * `allowed_object_types` - The object types that were allowed.
    /// * `allowed_locations` - The locations that were allowed.
    ///
    /// # Returns
    ///
    /// Returns a new summary.
    #[must_use]
    pub fn from_results(
        total_raws: &Vec<Box<dyn RawObject>>,
        allowed_object_types: &[ObjectType],
        allowed_locations: &[RawModuleLocation],
    ) -> Self {
        Self {
            total_raws: total_raws.len(),
            counts: Self::get_counts(total_raws),
            location_totals: Self::get_location_totals(total_raws),
            objects_allowed: allowed_object_types.to_vec(),
            locations: allowed_locations.to_vec(),
            ..Self::default()
        }
    }
    /// Gets the number of raws of each location.
    ///
    /// # Arguments
    ///
    /// * `total_raws` - All the parsed raws
    ///
    /// # Returns
    ///
    /// Returns a vector of tuples with the location and the number of raws at that location.
    #[must_use]
    pub fn get_location_totals(
        total_raws: &Vec<Box<dyn RawObject>>,
    ) -> Vec<(RawModuleLocation, usize)> {
        let mut location_totals: Vec<(RawModuleLocation, usize)> = Vec::new();
        for raw in total_raws {
            let metadata = raw.get_metadata();
            let location = metadata.get_location();
            let mut found = false;
            for (index, count) in location_totals.iter_mut().enumerate() {
                if count.0 == *location {
                    location_totals[index].1 += 1;
                    found = true;
                    break;
                }
            }
            if !found {
                location_totals.push((*location, 1));
            }
        }
        location_totals
    }
    /// Gets the number of raws of each type.
    ///
    /// # Arguments
    ///
    /// * `total_raws` - All the parsed raws
    ///
    /// # Returns
    ///
    /// Returns a vector of tuples with the object type and the number of raws of that type.
    #[must_use]
    pub fn get_counts(total_raws: &Vec<Box<dyn RawObject>>) -> Vec<(ObjectType, usize)> {
        let mut counts: Vec<(ObjectType, usize)> = Vec::new();
        for raw in total_raws {
            let object_type = raw.get_type();
            let mut found = false;
            for (index, count) in counts.iter_mut().enumerate() {
                if count.0 == *object_type {
                    counts[index].1 += 1;
                    found = true;
                    break;
                }
            }
            if !found {
                counts.push((object_type.clone(), 1));
            }
        }
        counts
    }
    /// Save the duration of the parsing process.
    ///
    /// # Arguments
    ///
    /// * `duration` - The duration of the parsing process.
    pub fn set_parsing_duration(&mut self, duration: Duration) {
        self.parsing_duration = format!("{duration:?}");
    }
    /// Save the duration of saving all raws to the store.
    ///
    /// # Arguments
    ///
    /// * `duration` - The duration of saving all raws to the store.
    pub fn set_save_to_store_duration(&mut self, duration: Duration) {
        self.save_to_store_duration = format!("{duration:?}");
    }
    /// Save the duration of the filtering process.
    ///
    /// # Arguments
    ///
    /// * `duration` - The duration of the filtering process.
    pub fn set_filtering_duration(&mut self, duration: Duration) {
        self.filtering_duration = format!("{duration:?}");
    }
}
