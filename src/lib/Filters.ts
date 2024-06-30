import type { Filter, SearchFilter } from "../../src-tauri/bindings/Bindings.d.ts";

/**
 * Check if an ObjectType is included in a SearchFilter as a Filter of type objectType.
 */
export function isObjectTypeIncluded(searchFilters: SearchFilter[], objectType: string): boolean {
	for (const searchFilter of searchFilters) {
		for (const filter of searchFilter.filters) {
			if (Object.keys(filter).includes("object") && Object.values(filter).includes(objectType)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Check if a Biome is included in a SearchFilter as a Filter of type biome.
 */
export function isBiomeIncluded(searchFilters: SearchFilter[], biome: string): boolean {
	for (const searchFilter of searchFilters) {
		for (const filter of searchFilter.filters) {
			if (Object.keys(filter).includes("biome") && Object.values(filter).includes(biome)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Check if a module_id is included in a SearchFilter as a Filter of type module.
 */
export function isModuleIncluded(searchFilters: SearchFilter[], module_id: string): boolean {
	for (const searchFilter of searchFilters) {
		for (const filter of searchFilter.filters) {
			if (Object.keys(filter).includes("module") && Object.values(filter).includes(module_id)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Check if a location is included in a SearchFilter as a Filter of type location.
 */
export function isLocationIncluded(searchFilters: SearchFilter[], location: string): boolean {
	for (const searchFilter of searchFilters) {
		for (const filter of searchFilter.filters) {
			if (Object.keys(filter).includes("location") && Object.values(filter).includes(location)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Check if a creature is included in a SearchFilter as a Filter of type creature.
 */
export function isCreatureIncluded(searchFilters: SearchFilter[], creature: string): boolean {
	for (const searchFilter of searchFilters) {
		for (const filter of searchFilter.filters) {
			if (Object.keys(filter).includes("creature") && Object.values(filter).includes(creature)) {
				return true;
			}
		}
	}
	return false;
}
