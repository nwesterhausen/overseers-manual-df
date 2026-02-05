import {
  persistStoredSettings,
  retrieveStoredSettings,
} from "bindings/Commands";
import type { LocationHelper, RawModuleLocation } from "bindings/DFRawParser";
import type { StoredSettings } from "bindings/Structs";
import { appState } from "./app.svelte";

export const settingsState = $state<StoredSettings>({
  dfDirectory: "",
  userDirectory: "",
  parseLocations: ["Vanilla"],
  databaseLocation: "",
  randomizeImageRotation: true,
  enableDirectoryDetection: true,
  startupAction: "nothing",
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
      settingsState.dfDirectory && settingsState.dfDirectory.length > 0
        ? settingsState.dfDirectory
        : null,
    user_data_directory:
      settingsState.userDirectory && settingsState.userDirectory.length > 0
        ? settingsState.userDirectory
        : null,
  };
};

/**
 * Async function to fetch data from Tauri and update state
 */
export const loadStoredSettings = async () => {
  try {
    appState.status = "loading";

    // Example: Invoke your Tauri command
    // Replace 'get_settings' with your actual backend command
    const storedSettings = await retrieveStoredSettings();

    // Bulk update the state with the response
    // In Svelte 5, you can just assign properties directly
    if (storedSettings.dfDirectory)
      settingsState.dfDirectory = storedSettings.dfDirectory;
    if (storedSettings.userDirectory)
      settingsState.userDirectory = storedSettings.userDirectory;
    settingsState.databaseLocation = storedSettings.databaseLocation;
    settingsState.enableDirectoryDetection =
      storedSettings.enableDirectoryDetection;
    settingsState.parseLocations = storedSettings.parseLocations;
    settingsState.randomizeImageRotation =
      storedSettings.randomizeImageRotation;
    settingsState.startupAction = settingsState.startupAction;

    appState.status = "ready";
  } catch (error) {
    console.error("Failed to load settings:", error);
    appState.errorMessage = String(error);
    appState.status = "error";
  }
};
/**
 * Persist current settings to the backend.
 * Returns early if the app is not in 'ready' state to avoid saving during load.
 */
export const saveSettings = async () => {
  // This prevents the "Load Loop" where loading data triggers a save.
  if (appState.status !== "ready") return;

  try {
    await persistStoredSettings({
      dfDirectory: settingsState.dfDirectory || null,
      userDirectory: settingsState.userDirectory || null,
      parseLocations: settingsState.parseLocations,
      databaseLocation: settingsState.databaseLocation,
      randomizeImageRotation: settingsState.randomizeImageRotation,
      enableDirectoryDetection: settingsState.enableDirectoryDetection,
      startupAction: settingsState.startupAction,
    });
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};
