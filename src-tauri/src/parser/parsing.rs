use std::num::ParseIntError;

use super::raws::tags;

pub fn parse_min_max_range(split: &[&str]) -> Result<[u16; 2], ParseIntError> {
    let min: u16 = match split[0].parse() {
        Ok(n) => n,
        Err(e) => {
            log::error!("min_value parsing error\n{:?}", e);
            return Err(e);
        }
    };
    let max: u16 = match split[1].parse() {
        Ok(n) => n,
        Err(e) => {
            log::error!("max_value parsing error\n{:?}", e);
            return Err(e);
        }
    };
    Ok([min, max])
}

pub fn parse_body_size(split: &[&str]) -> Result<tags::DFBodySize, ParseIntError> {
    let years: u32 = match split[0].parse() {
        Ok(n) => n,
        Err(e) => {
            log::error!("Unable to parse years from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    let days: u32 = match split[1].parse() {
        Ok(n) => n,
        Err(e) => {
            log::error!("Unable to parse days from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    let size: u32 = match split[2].parse() {
        Ok(n) => n,
        Err(e) => {
            log::error!("Unable to parse size from BODY_SIZE\n{:?}", e);
            return Err(e);
        }
    };
    Ok(tags::DFBodySize::new(years, days, size))
}
