use dfraw_json_parser::biome::Token as Biome;

#[tauri::command]
#[specta::specta]
#[allow(clippy::needless_pass_by_value)]
pub async fn get_biome_description(biome_token: Biome) -> Result<String, ()> {
    Ok(biome_token.to_string())
}
