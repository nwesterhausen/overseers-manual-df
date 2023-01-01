/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
  objectId: string;
  identifier: string;
  name: string;
  parent_raw: string;
  searchString?: string[]; //Used in project 'overseers-manual-df'
  tags: string[];
  raw_module: string;
  raw_module_version: string;
  raw_type: string;
  raw_module_found_in: string;
  raw_module_display: string;
  raw_module_parents?: string[]; //Use in 'overseers-manual-df'
  all_tags?: string[]; //Use in 'overseers-manual-df'
};

export type BodySizeRange = {
  years: number;
  days: number;
  size_cm3: number;
};

export type MilkableDesc = {
  material: string;
  frequency: number;
};

export type CasteRange<T> = {
  [key: string]: T;
};

export type Creature = {
  max_age: CasteRange<number[]>;
  clutch_size: CasteRange<number[]>;
  based_on?: string;
  biomes: string[];
  cluster_range: number[];
  underground_depth: number[];
  body_size: CasteRange<BodySizeRange[]>;
  grown_at: CasteRange<number>;
  names_map: CasteRange<string[]>;
  egg_sizes: CasteRange<number>;
  pet_value: CasteRange<number>;
  intelligence: CasteRange<boolean[]>;
  flier: CasteRange<boolean>;
  gnawer: CasteRange<boolean>;
  trainable: CasteRange<number>;
  active_time: CasteRange<number>;
  inactive_season: CasteRange<number>;
  creature_class: CasteRange<string[]>;

  caste_tags: CasteRange<string[]>;

  difficulty: CasteRange<number>;
  grass_trample: CasteRange<number>;
  grazer: CasteRange<number>;
  low_light_vision: CasteRange<number>;
  pop_ratio: CasteRange<number>;
  milkable: CasteRange<MilkableDesc>;

  pref_string: string[];
  population_number: number[];

  descriptions: CasteRange<string>;
} & Raw;

export type SingPluralName = {
  singular: string;
  plural: string;
}

export type StateName = {
  solid: string;
  liquid: string;
  gas: string;
}

export type SimpleMaterial = {

  material_type: string;
  state_name: StateName;
  state_adj: StateName;
  material_value: number;
  tags: string[];
  state_color: String;
}

// Plant raw definition
export type Plant = {

  name: string;
  pref_string: string;
  value: number;

  // Environment Tokens
  underground_depth: number[];
  frequency: number;
  cluster_size: number;
  biomes: string[];
  // pub growth: DFPlantGrowth,
  // pub materials: Vec<DFMaterialTemplate>,
  // pub seed: DFPlantSeed,
  // Sub Tags
  materials: SimpleMaterial[];
  growth_names: {
    [growth: string]: SingPluralName;
  }
  growth_duration: number;
} & Raw;

// Definition for tauri progress event payload
export type ProgressPayload = {
  current_module: string;
  percentage: number;
};

// info.txt raw definition
export type DFInfoFile = {
  identifier: string;
  sourced_directory: string;
  numeric_version: number;
  displayed_version: string;
  earliest_compatible_numeric_version: number;
  earliest_compatible_displayed_version: string;
  author: string;
  name: string;
  description: string;
  objectId: string;
  display_title: string; // used in 'overseers-manual-df'
};
