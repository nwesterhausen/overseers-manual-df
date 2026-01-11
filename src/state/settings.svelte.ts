import type { RawModuleLocation } from "bindings/DFRawParser";

interface Settings {
  dfDirectory: string;
  userDirectory: string;
  parseLocations: RawModuleLocation[];
  databaseLocation: string;
  randomizeImageRotation: boolean;
  enableDirectoryDetection: boolean;
}

export const settingsState = $state<Settings>({
  dfDirectory: "",
  userDirectory: "",
  parseLocations: ["Vanilla"],
  databaseLocation: "",
  randomizeImageRotation: true,
  enableDirectoryDetection: true,
});

export const toggleDirectoryDetection = function () {
  settingsState.enableDirectoryDetection =
    !settingsState.enableDirectoryDetection;
};

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
