// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { BodySize } from "./BodySize";
import type { CasteTag } from "./CasteTag";
import type { Gait } from "./Gait";
import type { Milkable } from "./Milkable";
import type { Name } from "./Name";
import type { SingPlurName } from "./SingPlurName";
import type { Tile } from "./Tile";

export interface Caste {
  identifier: string;
  tags: Array<CasteTag>;
  description: string;
  babyName: SingPlurName;
  casteName: Name;
  childName: SingPlurName;
  clutchSize: Array<number>;
  litterSize: Array<number>;
  maxAge: Array<number>;
  baby: number;
  child: number;
  difficulty: number;
  eggSize: number;
  grassTrample: number;
  grazer: number;
  lowLightVision: number;
  petValue: number;
  popRatio: number;
  changeBodySizePercentage: number;
  creatureClass: Array<string>;
  bodySize: Array<BodySize>;
  milkable: Milkable;
  tile: Tile;
  gaits: Array<Gait>;
}
