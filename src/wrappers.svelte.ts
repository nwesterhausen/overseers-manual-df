import { parseRaws } from "bindings/Commands";
import type { LocationHelper } from "bindings/DFRawParser";
import type { DbOptionOnParse } from "bindings/Structs";
import { settingsState } from "state/settings.svelte";

/**
 * Wrapper around a 'parse_raws' invoke call to avoid reusing the same code in multiple places.
 *
 * @param dbOption how to handle the parsing results
 */
export const executeParse = function (dbOption: DbOptionOnParse) {
  const locations = getLocationHelper();
  settingsState.appState = "parsing";
  parseRaws(locations, settingsState.parseLocations, dbOption)
    .then(() => (settingsState.appState = "ready"))
    .catch((e) => {
      settingsState.appState = "error";
      settingsState.errorMessage = e;
      console.error(e);
    });
};

function getLocationHelper(): LocationHelper {
  return {
    df_directory:
      settingsState.dfDirectory.length > 0 ? settingsState.dfDirectory : null,
    user_data_directory:
      settingsState.userDirectory.length > 0
        ? settingsState.userDirectory
        : null,
  };
}
