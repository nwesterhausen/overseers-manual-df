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
