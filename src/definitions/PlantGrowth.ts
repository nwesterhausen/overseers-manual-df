// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { GrowthTag } from "./GrowthTag";
import type { GrowthType } from "./GrowthType";
import type { PlantPart } from "./PlantPart";
import type { SingPlurName } from "./SingPlurName";

export interface PlantGrowth {
  growthType: GrowthType;
  name: SingPlurName;
  item: string;
  hostTiles: Array<PlantPart>;
  trunkHeightPercentage: Array<number>;
  density: number;
  print: string;
  timing: Array<number>;
  tags: Array<GrowthTag>;
}
