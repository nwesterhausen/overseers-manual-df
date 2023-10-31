// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Biome } from './Biome';
import type { ObjectType } from './ObjectType';
import type { RawModuleLocation } from './RawModuleLocation';

export interface SearchOptions {
  limit: number;
  page: number;
  objectTypes: Array<ObjectType>;
  query: string;
  locations: Array<RawModuleLocation>;
  biomes: Array<Biome>;
  onlyEggLayers: boolean;
  showDoesNotExist: boolean;
}
