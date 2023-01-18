/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
  objectId: string;
  identifier: string;
  name: string;
  parentRaw: string;
  tags: string[];
  rawModule: string;
  moduleVersion: string;
  moduleSourceDirectory: string;
  moduleDisplayName: string;
  rawType: string;
  rawRelativePath: string;
  overwriteRaw: string;

  // Added types for this app
  searchString: string;
  rawModuleParents?: string[];
  allTags?: string[];
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
  maxAge: CasteRange<number[]>;
  clutchSize: CasteRange<number[]>;
  basedOn?: string;
  biomes: string[];
  clusterRange: number[];
  undergroundDepth: number[];
  bodySize: CasteRange<BodySizeRange[]>;
  grownAt: CasteRange<number>;
  childAt: CasteRange<number>;
  namesMap: CasteRange<string[]>;
  eggSizes: CasteRange<number>;
  petValue: CasteRange<number>;
  intelligence: CasteRange<boolean[]>;
  flier: CasteRange<boolean>;
  gnawer: CasteRange<boolean>;
  trainable: CasteRange<number>;
  activeTime: CasteRange<number>;
  inactiveSeason: CasteRange<number>;
  creatureClass: CasteRange<string[]>;

  casteTags: CasteRange<string[]>;

  difficulty: CasteRange<number>;
  grassTrample: CasteRange<number>;
  grazer: CasteRange<number>;
  lowlightVision: CasteRange<number>;
  populationRatio: CasteRange<number>;
  milkable: CasteRange<MilkableDesc>;

  preferenceStrings: string[];
  populationNumber: number[];

  descriptions: CasteRange<string>;
} & Raw;

export type SingPluralName = {
  singular: string;
  plural: string;
};

export type StateName = {
  solid: string;
  liquid: string;
  gas: string;
};

export type Temperatures = {
  specificHeat: number;
  ignitionPoint: number;
  meltingPoint: number;
  boilingPoint: number;
  heatDamagePoint: number;
  coldDamagePoint: number;
  materialFixedTemp: number;
};

export type SimpleMaterial = {
  type: string;
  names: StateName;
  adjectives: StateName;
  value: number;
  colors: StateName;
  tags: string[];
  syndromes: string[];
  temperatures: Temperatures;
  reactionClasses: string[];
};

// Plant raw definition
export type DFPlant = {
  name: string;
  preferenceStrings: string[];
  value: number;

  // Environment Tokens
  undergroundDepth: number[];
  frequency: number;
  clusterSize: number;
  biomes: string[];
  // pub growth: DFPlantGrowth,
  // pub materials: Vec<DFMaterialTemplate>,
  // pub seed: DFPlantSeed,
  // Sub Tags
  materials: SimpleMaterial[];
  growthNames: {
    [growth: string]: SingPluralName;
  };
  growthDuration: number;
} & Raw;

export type Environment = {
  surroundingRock: string;
  grouping: string;
  frequency: number;
};

export type RollChance = {
  result: string;
  chance: number;
};

// Inorganic Raw definition
export type DFInorganic = {
  name: string;
  material: SimpleMaterial;
  environments: Environment[];
  specificEnvironments: Environment[];
  metalOres: RollChance[];
  threadMetals: RollChance[];

  magmaSafe: boolean;
} & Raw;

// info.txt raw definition
export type DFInfoFile = {
  identifier: string;
  sourcedDirectory: string;
  numericVersion: number;
  displayedVersion: string;
  earliestCompatibleNumericVersion: number;
  earliestCompatibleDisplayedVersion: string;
  author: string;
  name: string;
  description: string;
  displayTitle: string;
  objectId: string;
  relativePath: string;
};

// Definition for tauri progress event payload
export type ProgressPayload = {
  currentModule: string;
  percentage: number;
  currentTask: string;
  currentFile: string;
  currentLocation: string;
};
