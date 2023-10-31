use dfraw_json_parser::parser::biome::tokens::Biome;

#[tauri::command]
#[allow(clippy::needless_pass_by_value)]
pub fn get_biome_description(biome_token: Biome) -> String {
    biome_token.to_string()
}
