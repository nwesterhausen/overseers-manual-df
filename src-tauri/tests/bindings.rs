#[test]
fn generate_ts_bindings() {
    // get our current working directory
    let cwd = std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
    // set lib/bindings as the output directory
    let output_dir = cwd.join("bindings");
    // make sure output dir exists
    if let Err(e) = std::fs::create_dir_all(&output_dir) {
        eprintln!("Failed to create output directory: {e}");
        return;
    }

    // Create a config to use for the specta::ts::export function
    let config = specta::ts::ExportConfiguration::default()
        .export_by_default(Some(true))
        .bigint(specta::ts::BigIntExportBehavior::Number);

    let bindings: Vec<String> = vec![
        export_type::<app_lib::search_handler::options::SearchOptions>(&config),
        export_type::<app_lib::search_handler::filtering::Filter>(&config),
        export_type::<app_lib::search_handler::filtering::SearchFilter>(&config),
        // Note that search_handler::results::SearchResults is not exported because it contains a Box<dyn RawObject>
        // which cannot be exported to TypeScript.
        //
        export_type::<app_lib::search_handler::summary::Summary>(&config),
        export_type::<app_lib::graphics::options::GraphicsOptions>(&config),
        export_type::<app_lib::graphics::results::GraphicsResults>(&config),
        // Note that state::Storage is not exported because it contains a Box<dyn RawObject> which cannot be exported.
        //
        export_type::<app_lib::state::GraphicStorage>(&config),
        export_type::<app_lib::state::ModuleInfoStorage>(&config),
        export_type::<app_lib::info::Info>(&config),
        export_type::<app_lib::tracking::ParseAllRawsInfo>(&config),
        export_type::<app_lib::tracking::ParseAndStoreRaws>(&config),
        export_type::<app_lib::tracking::SkipUpdate>(&config),
        export_type::<app_lib::tracking::ApplyUpdate>(&config),
        export_type::<app_lib::tracking::AppStarted>(&config),
        export_type::<app_lib::tracking::AppExited>(&config),
        // Types used from dfraw_json_parser
        export_type::<dfraw_json_parser::ParserOptions>(&config),
        export_type::<dfraw_json_parser::biome::Token>(&config),
        export_type::<dfraw_json_parser::creature::Creature>(&config),
        export_type::<dfraw_json_parser::creature::Token>(&config),
        export_type::<dfraw_json_parser::creature_caste::Gait>(&config),
        export_type::<dfraw_json_parser::creature_caste::GaitType>(&config),
        export_type::<dfraw_json_parser::creature_caste::GaitModifier>(&config),
        export_type::<dfraw_json_parser::creature_caste::Token>(&config),
        export_type::<dfraw_json_parser::creature_caste::Caste>(&config),
        export_type::<dfraw_json_parser::creature_effect::PropertyToken>(&config),
        export_type::<dfraw_json_parser::creature_effect::Token>(&config),
        export_type::<dfraw_json_parser::creature_variation::CreatureVariation>(&config),
        export_type::<dfraw_json_parser::creature_variation::Rule>(&config),
        export_type::<dfraw_json_parser::creature_variation::Token>(&config),
        export_type::<dfraw_json_parser::entity::Entity>(&config),
        export_type::<dfraw_json_parser::entity::Token>(&config),
        export_type::<dfraw_json_parser::graphics::Graphic>(&config),
        export_type::<dfraw_json_parser::graphics::SpriteGraphic>(&config),
        export_type::<dfraw_json_parser::graphics::SpriteLayer>(&config),
        export_type::<dfraw_json_parser::graphics::TilePage>(&config),
        export_type::<dfraw_json_parser::graphics::ColorModificationToken>(&config),
        export_type::<dfraw_json_parser::graphics::ConditionToken>(&config),
        export_type::<dfraw_json_parser::graphics::GraphicTypeToken>(&config),
        export_type::<dfraw_json_parser::graphics::GrowthToken>(&config),
        export_type::<dfraw_json_parser::graphics::PlantGraphicTemplateToken>(&config),
        export_type::<dfraw_json_parser::graphics::TilePageToken>(&config),
        export_type::<dfraw_json_parser::inorganic::Inorganic>(&config),
        export_type::<dfraw_json_parser::inorganic::EnvironmentClassToken>(&config),
        export_type::<dfraw_json_parser::inorganic::InclusionTypeToken>(&config),
        export_type::<dfraw_json_parser::inorganic::Token>(&config),
        export_type::<dfraw_json_parser::material::Material>(&config),
        export_type::<dfraw_json_parser::material::FuelTypeToken>(&config),
        export_type::<dfraw_json_parser::material::PropertyToken>(&config),
        export_type::<dfraw_json_parser::material::StateToken>(&config),
        export_type::<dfraw_json_parser::material::TypeToken>(&config),
        export_type::<dfraw_json_parser::material::UsageToken>(&config),
        export_type::<dfraw_json_parser::material_template::MaterialTemplate>(&config),
        export_type::<dfraw_json_parser::plant::Plant>(&config),
        export_type::<dfraw_json_parser::plant::Token>(&config),
        export_type::<dfraw_json_parser::plant_growth::PlantGrowth>(&config),
        export_type::<dfraw_json_parser::plant_growth::Token>(&config),
        export_type::<dfraw_json_parser::plant_growth::TypeToken>(&config),
        export_type::<dfraw_json_parser::plant_growth::PlantPartToken>(&config),
        export_type::<dfraw_json_parser::position::Position>(&config),
        export_type::<dfraw_json_parser::position::Token>(&config),
        export_type::<dfraw_json_parser::seed_material::SeedMaterial>(&config),
        export_type::<dfraw_json_parser::select_creature::SelectCreature>(&config),
        export_type::<dfraw_json_parser::select_creature::SelectRules>(&config),
        export_type::<dfraw_json_parser::shrub::Shrub>(&config),
        export_type::<dfraw_json_parser::shrub::SeasonToken>(&config),
        export_type::<dfraw_json_parser::shrub::Token>(&config),
        export_type::<dfraw_json_parser::syndrome::Syndrome>(&config),
        export_type::<dfraw_json_parser::syndrome::Token>(&config),
        export_type::<dfraw_json_parser::tree::Tree>(&config),
        export_type::<dfraw_json_parser::tree::Token>(&config),
        export_type::<dfraw_json_parser::tree::TwigPlacementToken>(&config),
        export_type::<dfraw_json_parser::unprocessed_raw::UnprocessedRaw>(&config),
        export_type::<dfraw_json_parser::unprocessed_raw::Modification>(&config),
        export_type::<dfraw_json_parser::parser::MaterialMechanics>(&config),
        export_type::<dfraw_json_parser::parser::RawMetadata>(&config),
        export_type::<dfraw_json_parser::parser::ModuleInfoFile>(&config),
        export_type::<dfraw_json_parser::parser::SteamData>(&config),
        export_type::<dfraw_json_parser::parser::StateName>(&config),
        export_type::<dfraw_json_parser::parser::MechanicalProperties>(&config),
        export_type::<dfraw_json_parser::parser::Name>(&config),
        export_type::<dfraw_json_parser::parser::SingPlurName>(&config),
        export_type::<dfraw_json_parser::parser::ObjectType>(&config),
        export_type::<dfraw_json_parser::parser::RawModuleLocation>(&config),
        export_type::<dfraw_json_parser::parser::BodySize>(&config),
        export_type::<dfraw_json_parser::parser::Color>(&config),
        export_type::<dfraw_json_parser::parser::Milkable>(&config),
        export_type::<dfraw_json_parser::parser::Temperatures>(&config),
        export_type::<dfraw_json_parser::parser::Tile>(&config),
        export_type::<dfraw_json_parser::parser::graphics::Dimensions>(&config),
        export_type::<dfraw_json_parser::parser::graphics::CustomGraphicExtension>(&config),
        export_type::<dfraw_json_parser::ProgressPayload>(&config),
        export_type::<dfraw_json_parser::ProgressTask>(&config),
        export_type::<dfraw_json_parser::ProgressDetails>(&config),
    ];

    write_bindings(
        &output_dir,
        bindings
            .iter()
            .map(std::string::String::as_str)
            .collect::<Vec<&str>>()
            .as_slice(),
    );
}

fn header(struct_path: &str) -> String {
    format!("// File generated by specta. Do not edit!\n//\n/// lib/{struct_path}\n\n")
}

fn export_type<T: std::fmt::Debug + specta::NamedType>(
    config: &specta::ts::ExportConfiguration,
) -> String {
    match specta::ts::export::<T>(config) {
        Ok(x) => x,
        Err(e) => {
            tracing::error!("{:?}", e);
            String::new()
        }
    }
}

fn write_bindings(output_dir: &std::path::Path, bindings: &[&str]) {
    // write the bindings to the output file
    match std::fs::write(
        output_dir
            .join("Bindings.d.ts")
            .as_os_str()
            .to_str()
            .unwrap_or_default(),
        format!(
            "{}\n{}",
            header("overseers_manual_df"),
            &bindings.join("\n")
        ),
    ) {
        Err(e) => {
            tracing::error!("{e:?}");
            tracing::error!("Failed to write bindings to file");
        }
        Ok(()) => {
            tracing::info!("Wrote bindings to file");
        }
    }
}
