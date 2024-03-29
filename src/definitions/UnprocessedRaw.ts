// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Modification } from "./Modification";
import type { ObjectType } from "./ObjectType";
import type { RawMetadata } from "./RawMetadata";

export interface UnprocessedRaw {
  rawType: ObjectType;
  modifications: Array<Modification>;
  metadata: RawMetadata;
  identifier: string;
}
