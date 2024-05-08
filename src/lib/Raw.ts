import type { InfoFile, Name, SingPlurName } from "../definitions/DFRawJson";
import type { Raw } from "../definitions/types";
import { toTitleCase } from "./Utils";

/**
 * Helper to display the "NAME vVERSION" for a module, or just the module if there isn't module info available.
 * Example usage:
 * `labelForModule(rawsContext.rawsInfo.latest.find(v => v.identifier === module), module)`
 * @param moduleInfo - The module info to get a label for.
 * @param moduleId - The module ID to use if the module info is undefined.
 * @returns A formatted label for the module.
 */
export function labelForModule(moduleInfo: InfoFile | undefined, moduleId?: string): string {
	if (typeof moduleId !== "undefined") {
		return moduleId || "";
	}
	if (typeof moduleInfo === "undefined") {
		return "unknown (undefined)";
	}

	return `${moduleInfo.name || "unknown"} v${moduleInfo.displayedVersion || "?"}`;
}

/**
 * Tries to return a valid name for the given raw.
 * @param raw - The `raw` to get a name for
 * @returns The name of the raw, or an empty string if it can't be found.
 */
export function nameForRaw(raw: Raw): string {
	const namedRaw = raw as unknown as { name?: string | Name | SingPlurName };
	if (typeof namedRaw.name === "string") {
		return toTitleCase(namedRaw.name);
	}
	if (typeof namedRaw.name === "object") {
		return toTitleCase(namedRaw.name.singular || namedRaw.name.plural || raw.identifier.replace(/_/g, " "));
	}
	return toTitleCase(raw.identifier.replace(/_/g, " "));
}
