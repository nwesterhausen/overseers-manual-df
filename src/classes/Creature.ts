import { Raw } from "./Raw";

export type Creature = {
  parent_raw: string;
  max_age: CasteRangeSpecifier;
  lays_eggs: boolean;
  clutch_size: CasteRangeSpecifier;
  based_on?: Creature;
} & Raw;

type CasteRangeSpecifier = {
  [key: string]: number[];
};
