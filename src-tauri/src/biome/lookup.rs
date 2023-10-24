#[tauri::command]
pub fn get_biome_description(biome_token: &str) -> String {
    let Some(biome) = dfraw_json_parser::parser::biomes::BIOMES.get(biome_token) else {
        return biome_token.to_string();
    };
    (*biome).to_string()
}
