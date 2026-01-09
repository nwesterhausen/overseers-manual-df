import type { ObjectType, RawModuleLocation } from "bindings/DFRawParser";

export const typeOptions: { label: string; value: ObjectType }[] = [
  { label: "Creature", value: "Creature" },
  { label: "Plant", value: "Plant" },
  { label: "Material", value: "Inorganic" }, // Mapping Material to Inorganic
  { label: "Entity", value: "Entity" },
];
export const locationOptions: { label: string; value: RawModuleLocation }[] = [
  { label: "Vanilla Raws", value: "Vanilla" },
  { label: "Installed Raws", value: "InstalledMods" },
  { label: "Workshop Mods", value: "WorkshopMods" },
];
