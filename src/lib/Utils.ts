import type { Creature, Material, Name, SingPlurName, StateName } from "../../src-tauri/bindings/Bindings";
import { DepthRanges, M3_to_CM3 } from "./Constants";
import { GAME_TICKS_ADVENTURE, GAME_TICKS_FORTRESS, SpecificTickToCalendarConversion } from "./GameTicks";

/**
 * Returns volume in cubic meters when given cubic centimeters
 *
 * @param cm3 - Volume in cubic centimeter
 * @returns Volume in cubic meter
 */
export function ConvertCm3ToM3(cm3: number): number {
	return cm3 / M3_to_CM3;
}

/**
 * Returns a string describing the volume.
 *
 * @param volume_cm3 - Volume in cubic centimeter
 * @returns String describing the volume (w/ unit)
 */
export function SimplifyVolume(volume_cm3: number): string {
	// if (volume_cm3 >= 0.5 * M3_to_CM3) {
	//     let value = ConvertCm3ToM3(volume_cm3).toFixed(3)
	//     while(value.endsWith('0') || value.endsWith('.')) {
	//       value = value.slice(0,-1);
	//     }
	//     return `${value} m³`
	// }
	return `${volume_cm3.toLocaleString()} cm³`;
}

/**
 * Returns the given string with the first letter capitalized and the rest lower cased.
 *
 * @param str - String to convert to "Title Case"
 * @returns String in Title Case
 */
export function toTitleCase(str: string): string {
	if (typeof str !== "string") {
		return "";
	}

	// Support strings with spaces, and make our title case very title-y
	if (/\s/.test(str)) {
		return str
			.split(/\s/)
			.filter((s) => s.length > 0)
			.map((s) => (s.length > 1 ? `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}` : s.toUpperCase()))
			.join(" ");
	}

	if (str.length < 2) {
		return str.toUpperCase();
	}

	return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}

/**
 * Returns a single string containing all provided names.
 *
 * @param castes - Either an array of names or a names_map to turn into a searchable name string
 * @returns A string with all names inside of it
 */
export function SearchableNames(creature: Creature): string {
	const flatNames: string[] = [];

	if (creature.name && creature.name.singular.length > 0) {
		flatNames.push(...creature.name.singular, ...creature.name.plural, ...creature.name.adjective);
	}
	if (creature.generalBabyName && creature.generalBabyName.singular.length > 0) {
		flatNames.push(...creature.generalBabyName.singular, ...creature.generalBabyName.plural);
	}
	if (creature.generalChildName && creature.generalChildName.singular.length > 0) {
		flatNames.push(...creature.generalChildName.singular, ...creature.generalChildName.plural);
	}

	if (Array.isArray(creature.castes)) {
		for (const caste of creature.castes) {
			if (caste.casteName && caste.casteName.singular.length > 0) {
				flatNames.push(...caste.casteName.singular, ...caste.casteName.plural);
			}
			if (caste.childName && caste.childName.singular.length > 0) {
				flatNames.push(...caste.childName.singular, ...caste.childName.plural);
			}
			if (caste.babyName && caste.babyName.singular.length > 0) {
				flatNames.push(...caste.babyName.singular, ...caste.babyName.plural);
			}
		}
	}

	const uniqueNames = [...new Set(flatNames)];
	return uniqueNames.join(" ");
}

/**
 * Returns a condensed string representing the array of names.
 *
 * @param names - Names in an array
 * @returns A string with names condensed as much as possible
 */
export function CleanName(names: string[]): string {
	if (names.length < 2) {
		return [...new Set(names)].filter((n) => n.length > 0).join(", ");
	}
	const singular = names[0];
	const plural = names[1];
	if (singular === plural || plural === "") {
		return `${singular}`;
	}
	if (plural.startsWith(singular)) {
		return `${singular}(${plural.slice(singular.length)})`;
	}
	if (plural.endsWith("men")) {
		if (plural.endsWith("women")) {
			return `${singular}/women`;
		}
		return `${singular}/men`;
	}
	return `${singular}, ${plural}`;
}

/**
 * Formats a name, whether it's a string, `Name`, `SingPlurName` or `StateName`.
 *
 * @param name - The name to format
 * @returns A formatted name in title case.
 */
export function FormatName(name: string | Name | SingPlurName | StateName): string {
	if (typeof name === "undefined") {
		return "Unknown";
	}
	if (typeof name === "string") {
		return toTitleCase(name);
	}
	// Check if name has 'singular' property
	if (Object.prototype.hasOwnProperty.call(name, "singular")) {
		return toTitleCase((name as Name).singular);
	}
	const stateName = name as StateName;
	if (stateName.solid.length > 0) {
		return toTitleCase(stateName.solid);
	}
	if (stateName.liquid.length > 0) {
		return toTitleCase(stateName.liquid);
	}
	if (stateName.gas.length > 0) {
		return toTitleCase(stateName.gas);
	}
	return "Unknown";
}

/**
 * Turn an amount of game ticks into a readable duration of time.
 *
 * @param gameTicks - The amount of game ticks to convert
 * @param fortressMode - Whether or not to use fortress mode game ticks (vs adventure mode)
 * @returns A string representing the amount of time. E.g. "1 Season, 2 Weeks, 3 Days, 4h 5m"
 */
export function TicksToCalendarDuration(gameTicks: number, fortressMode = true): string {
	if (fortressMode) {
		return SpecificTickToCalendarConversion(gameTicks, GAME_TICKS_FORTRESS);
	}

	return SpecificTickToCalendarConversion(gameTicks, GAME_TICKS_ADVENTURE);
}

/**
 * Turns `StateName` into a string array with the different states.
 *
 * @param states - The `StateName` to turn into a string array
 * @returns An array of strings with the different states
 */
export function StatesIntoFlatArray(states: StateName): string[] {
	return [states.solid, states.liquid, states.gas];
}

/**
 * The function "friendlyMaterialName" takes a material and a plant name as input and returns a
 * friendly name for the material.
 * @param material - The material parameter is of type Material, which represents a material
 * object.
 * @param plantName - The name of the plant where the material is produced.
 */
export function friendlyMaterialName(material: Material, plantName: string): string {
	const nameArr: string[] = [];
	if (material.stateAdjectives) {
		nameArr.push(material.stateAdjectives.solid);
	} else {
		nameArr.push(plantName);
	}
	if (material.isLocalMaterial && material.name !== "STRUCTURAL") {
		nameArr.push(material.name);
	}
	return toTitleCase(nameArr.join(" "));
}

/**
 * Turn the UNDERGROUND_DEPTH tag into a string description
 *
 * @param depth_range - [min,max] UNDERGROUND_DEPTH tag values
 * @returns string describing what depths they are found at
 */
export function UndergroundDepthDescription(depth_range: number[]): string {
	if (typeof depth_range === "undefined" || !Array.isArray(depth_range) || depth_range.length !== 2) {
		// Undefined depth_range means it is the default value.
		return "Aboveground";
	}
	const topLevel = depth_range[0];
	const bottomLevel = depth_range[1];
	if (topLevel === bottomLevel) {
		if (topLevel === 0) {
			return DepthRanges[topLevel];
		}
		return `in the ${DepthRanges[topLevel]}`;
	}
	const topDepth = DepthRanges[topLevel];
	const bottomDepth = DepthRanges[bottomLevel];

	if (topDepth.endsWith("Cavern Layer") && bottomDepth.endsWith("Cavern Layer")) {
		return `from ${topDepth.replace(" Cavern Layer", "")} to ${bottomDepth}`;
	}
	return `from ${DepthRanges[topLevel]} to ${DepthRanges[bottomLevel]}`;
}
