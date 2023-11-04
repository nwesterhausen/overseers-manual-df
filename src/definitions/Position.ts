// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Color } from './Color';
import type { PositionToken } from './PositionToken';
import type { SingPlurName } from './SingPlurName';

export interface Position {
  identifier: string;
  allowedClasses: Array<string>;
  allowedCreatures: Array<string>;
  appointedBy: string;
  color: Color;
  commander: string;
  demandMax: number;
  executionSkill: string;
  gender: string;
  landHolder: number;
  landName: string;
  mandateMax: number;
  name: SingPlurName;
  nameMale: SingPlurName;
  nameFemale: SingPlurName;
  number: number;
  precedence: number;
  rejectedClasses: Array<string>;
  rejectedCreatures: Array<string>;
  replacedBy: string;
  requiredBedroom: number;
  requiredBoxes: number;
  requiredCabinets: number;
  requiredDining: number;
  requiredOffice: number;
  requiredRacks: number;
  requiredStands: number;
  requiredTomb: number;
  requiresPopulation: number;
  responsibilities: Array<string>;
  spouse: SingPlurName;
  spouseFemale: SingPlurName;
  spouseMale: SingPlurName;
  squad: string;
  succession: string;
  tags: Array<PositionToken>;
}
