/**
 * The SearchProvider is responsible for managing the `SearchOptions` based on the user's input.
 * This takes into account not only the search string, but also the advanced filtering options.
 */
import { createContextProvider } from "@solid-primitives/context";
import { createMemo, createSignal } from "solid-js";
import type { SearchOptions } from "../../src-tauri/bindings/Bindings";
import { useSettingsContext } from "./SettingsProvider";

export const [SearchProvider, useSearchProvider] = createContextProvider(() => {
	// Grab the settings context. We actually keep many search options cached on disk via settings.
	const [settings] = useSettingsContext();

	// The typed search query (basically the value of the search box input)
	const [searchString, setSearchString] = createSignal("");

	// Whether to show creatures that are tagged with 'DoesNotExist' (i.e. creatures that are not in the game)
	const [showDoesNotExist, setShowDoesNotExist] = createSignal(false);

	/**
	 * Helper function to toggle the showDoesNotExist boolean
	 *
	 * @returns void
	 */
	function handleToggleShowDoesNotExist() {
		setShowDoesNotExist(!showDoesNotExist());
	}

	// Whether to only show creatures that lay eggs (i.e. one of their castes has the 'EggLayer' tag)
	const [onlyEggLayers, setOnlyEggLayers] = createSignal(false);
	/**
	 * Helper function to toggle the onlyEggLayers boolean
	 *
	 * @returns void
	 */
	function handleToggleOnlyEggLayers() {
		setOnlyEggLayers(!onlyEggLayers());
	}

	// A list of module object_id's to filter for search results. Having anything in this list will restrict
	// search results to only objects that are from the listed modules.
	const [filteredModules, setFilteredModules] = createSignal<string[]>([]);
	/**
	 * Helper function to add a module (or multiple modules) to the filtered modules list.
	 *
	 * @param module - The module(s) object_id(s) to add to the filtered modules list
	 * @returns void
	 */
	function addFilteredModule(module: string | string[]) {
		// Allow adding multiple modules at once
		if (Array.isArray(module)) {
			// Guard against adding the same module twice (via new Set())
			setFilteredModules([...new Set([...filteredModules(), ...module])]);
			return;
		}
		// Guard against adding the same module twice
		if (filteredModules().indexOf(module) === -1) {
			setFilteredModules([...filteredModules(), module]);
		}
	}
	/**
	 * Helper function to remove a module from the filtered modules list.
	 *
	 * @param module - The module object_id to remove from the filtered modules list
	 * @returns void
	 */
	function removeFilteredModule(module: string) {
		if (filteredModules().indexOf(module) !== -1) {
			setFilteredModules(filteredModules().filter((v) => v !== module));
		}
	}

	/**
	 * Helper function to remove all modules from the filtered modules list.
	 *
	 * @returns void
	 */
	function removeAllFilteredModules() {
		setFilteredModules([]);
	}

	// (Currently not active)
	// A list of tags that are required to be attached to an object for it to be included in search results.
	const [requiredTags, setRequiredTags] = createSignal<string[]>([]);

	/**
	 * Helper function to add a tag (or multiple tags) to the required tags list.
	 *
	 * @param tag - The tag(s) to add to the required tags list
	 * @returns void
	 */
	function addRequiredTag(tag: string | string[]) {
		// Allow adding multiple tags at once
		if (Array.isArray(tag)) {
			// Guard against adding the same tag twice (via new Set())
			setRequiredTags([...new Set([...requiredTags(), ...tag])]);
			return;
		}
		// Guard against adding the same tag twice
		if (requiredTags().indexOf(tag) === -1) {
			setRequiredTags([...requiredTags(), tag]);
		}
	}

	/**
	 * Helper function to remove a tag from the required tags list.
	 *
	 * @param tag - The tag to remove from the required tags list
	 * @returns void
	 */
	function removeRequiredTag(tag: string) {
		if (requiredTags().indexOf(tag) !== -1) {
			setRequiredTags(requiredTags().filter((v) => v !== tag));
		}
	}

	/**
	 * Helper function to remove all tags from the required tags list.
	 *
	 * @returns void
	 */
	function removeAllRequiredTags() {
		setRequiredTags([]);
	}

	// The actual search options object that is used for searching (see `RawsProvider`)
	const searchOptions = createMemo<SearchOptions>(() => {
		const options: SearchOptions = {
			limit: `${settings.resultsPerPage}`,
			page: `${settings.currentPage}`,
			objectTypes: settings.filtering.objectTypes,
			query: searchString(),
			locations: settings.filtering.locations,
			biomes: settings.filtering.biomes,
			modules: settings.filtering.modules,
			onlyEggLayers: onlyEggLayers(),
			showDoesNotExist: showDoesNotExist(),
		};

		// Todo: include advanced filtering options (tags) once supported by the backend

		return options;
	});

	return {
		// The basics (i.e. expose setting the search string and retrieval of the search options)
		setSearchString,
		searchOptions,

		// Raw Module Filtering
		filteredModules,
		addFilteredModule,
		removeFilteredModule,
		removeAllFilteredModules,

		// Tag Filtering
		requiredTags,
		addRequiredTag,
		removeRequiredTag,
		removeAllRequiredTags,

		// Other Filtering
		showDoesNotExist,
		handleToggleShowDoesNotExist,
		onlyEggLayers,
		handleToggleOnlyEggLayers,
	};
});
