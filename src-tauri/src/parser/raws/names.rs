use serde::{Deserialize, Serialize};
use std::fmt::Debug;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Name {
    singular: String,
    plural: String,
    adjective: String,
}

impl Name {
    // Take the arguments for a name and split ':' into sing, plural, adjective
    pub fn new(argument_text: &str) -> Self {
        let mut arg_names: Vec<&str> = argument_text.split(':').collect::<Vec<&str>>();
        let mut names: Vec<&str> = Vec::new();
        while !arg_names.is_empty() {
            names.push(arg_names.remove(0));
        }
        while names.len() < 3 {
            names.push("");
        }
        Self {
            singular: String::from(names[0]),
            plural: String::from(names[1]),
            adjective: String::from(names[2]),
        }
    }
    pub fn to_string_vec(&self) -> Vec<String> {
        if self.singular.eq(&self.adjective) {
            return vec![String::from(&self.singular), String::from(&self.plural)];
        }
        vec![
            String::from(&self.singular),
            String::from(&self.plural),
            String::from(&self.adjective),
        ]
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SingPlurName {
    singular: String,
    plural: String,
}

impl SingPlurName {
    pub fn new(argument_text: &str) -> Self {
        let mut arg_names: Vec<&str> = argument_text.split(':').collect::<Vec<&str>>();
        let mut names: Vec<&str> = Vec::new();
        while !arg_names.is_empty() {
            names.push(arg_names.remove(0));
        }
        while names.len() < 2 {
            names.push("");
        }
        Self {
            singular: String::from(names[0]),
            plural: String::from(names[1]),
        }
    }
    pub fn to_string_vec(&self) -> Vec<String> {
        vec![String::from(&self.singular), String::from(&self.plural)]
    }
}
