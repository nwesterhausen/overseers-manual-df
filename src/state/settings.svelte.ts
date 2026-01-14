import type { LocationHelper, RawModuleLocation } from "bindings/DFRawParser";
import type { StartupAction } from "searchOptions";

interface Settings {
  dfDirectory: string;
  userDirectory: string;
  parseLocations: RawModuleLocation[];
  databaseLocation: string;
  randomizeImageRotation: boolean;
  enableDirectoryDetection: boolean;
  startupAction: StartupAction;
  appState: "parsing" | "ready" | "error";
  errorMessage: string;
}

export const settingsState = $state<Settings>({
  dfDirectory: "",
  userDirectory: "",
  parseLocations: ["Vanilla"],
  databaseLocation: "",
  randomizeImageRotation: true,
  enableDirectoryDetection: true,
  startupAction: "nothing",
  appState: "ready",
  errorMessage: "",
});

/**
 * toggle the setting to enable directory auto-detection (of DF and user data dir)
 */
export const toggleDirectoryDetection = function () {
  settingsState.enableDirectoryDetection =
    !settingsState.enableDirectoryDetection;
};

/**
 * toggle a location in the chosen locations to parse
 *
 * @param location location to toggle included/excluded from the parsing locations
 */
export const toggleLocation = function (location: RawModuleLocation) {
  if (settingsState.parseLocations.includes(location)) {
    // Remove it if it's already there
    settingsState.parseLocations = settingsState.parseLocations.filter(
      (l) => l !== location,
    );
  } else {
    // Add it if it's not
    settingsState.parseLocations.push(location);
  }
};

/**
 * transforms the saved parsing locations array into a LocationHelper for ParsingOptions
 *
 * @returns a LocationHelper object to use in ParserOptions
 */
export const getLocationHelper = function (): LocationHelper {
  return {
    df_directory:
      settingsState.dfDirectory.length > 0 ? settingsState.dfDirectory : null,
    user_data_directory:
      settingsState.userDirectory.length > 0
        ? settingsState.userDirectory
        : null,
  };
};
