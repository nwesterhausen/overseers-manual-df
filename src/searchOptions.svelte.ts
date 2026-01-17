import type { ObjectType, RawModuleLocation } from "bindings/DFRawParser";

export type StartupAction = "nothing" | "parseInsert" | "parseUpdate" | "reset";

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
export const startupOptions: { label: string; value: StartupAction }[] = [
  { label: "Do nothing", value: "nothing" },
  { label: "Parse and insert", value: "parseInsert" },
  { label: "Parse and force update", value: "parseUpdate" },
  { label: "Reset then parse", value: "reset" },
];
