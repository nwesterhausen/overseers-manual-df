use std::num::ParseIntError;

use super::raws::creature;

pub fn parse_min_max_range(split: &[&str]) -> Result<[u16; 2], ParseIntError> {
    let min: u16 = match split[0].parse() {
        Ok(n) => n,
        Err(e) => {
            println!("min_value parsing error\n{:?}", e);
            return Err(e);
        }
    };
    let max: u16 = match split[1].parse() {
        Ok(n) => n,
        Err(e) => {
            println!("max_value parsing error\n{:?}", e);
            return Err(e);
        }
    };
    Ok([min, max])
}

pub fn parse_body_size(split: &[&str]) -> Result<creature::DFBodySize, ParseIntError> {
    let years: u32 = match split[0].parse() {
        Ok(n) => n,
        Err(e) => {
            println!("Unable to parse years from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    let days: u32 = match split[1].parse() {
        Ok(n) => n,
        Err(e) => {
            println!("Unable to parse days from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    let size: u32 = match split[2].parse() {
        Ok(n) => n,
        Err(e) => {
            println!("Unable to parse size from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    Ok(creature::DFBodySize::new(years, days, size))
}
