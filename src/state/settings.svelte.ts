import type { RawModuleLocation } from "bindings/DFRawParser";

interface Settings {
  df_dir: string;
  user_dir: string;
  parse_locations: RawModuleLocation[];
  database_location: string;
  randomizeImageRotation: boolean;
}

export const settingsState = $state<Settings>({
  df_dir: "",
  user_dir: "",
  parse_locations: ["Vanilla"],
  database_location: "",
  randomizeImageRotation: true,
});
