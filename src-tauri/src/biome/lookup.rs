use dfraw_json_parser::biome::Token as Biome;

/// Returns the description of a biome for a given biome token.
///
/// # Arguments
///
/// * `biome_token` - The biome token to get the description for.
///
/// # Errors
///
/// Returns an empty string if the biome token is not found.
///
/// # Returns
///
/// Returns the description of the biome.
#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub async fn get_biome_description(biome_token: Biome) -> Result<String, ()> {
    Ok(biome_token.to_string())
}
