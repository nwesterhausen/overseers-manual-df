/**
 * RawsProvider is a context provider that handles loading (and parsing) raws and exposing
 * them to the rest of the application.
 *
 * It relies on the SearchProvider to get the search options.
 *
 * It also relies on the SettingsProvider to get the directory path and the parsing options.
 * Settings also provides the number of results per page and the current page.
 */
import { createContextProvider } from "@solid-primitives/context";
import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
import { createEffect, createResource, createSignal } from "solid-js";
import type { Summary, ParserOptions, InfoFile, ObjectType, ProgressPayload } from "../../src-tauri/bindings/Bindings";
import {
	COMMAND_GET_RAWS_INFO,
	COMMAND_PARSE_AND_STORE_RAWS,
	COMMAND_SEARCH_RAWS,
	DEFAULT_PARSING_STATUS,
	DEFAULT_SEARCH_RESULT,
	DEFAULT_SUMMARY,
	PARSING_PROGRESS_EVENT,
	PARSING_SUMMARY_EVENT,
	STS_EMPTY,
	STS_IDLE,
	STS_PARSING,
} from "../lib/Constants";
import { useSearchProvider } from "./SearchProvider";
import { useSettingsContext } from "./SettingsProvider";
import type { SearchResults } from "../definitions/SearchResults";

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
	/**
	 * The current window (used for listening to events)
	 */
	const appWindow = getCurrent();

	// Search context provides the compiled search options
	const searchContext = useSearchProvider();
	// Settings context provides the directory path and the parsing options
	// We reset page when we parse the raws
	const [settings, { setTotalResults, resetPage }] = useSettingsContext();

	// Signal for setting raw parse status
	// This signal is exposed and is used in many components to affect how they render
	const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

	// Signal for loading raws
	const [loadRaws, setLoadRaws] = createSignal(false);

	// Signal for previous search options
	const [previousSearchOptions, setPreviousSearchOptions] = createSignal(searchContext.searchOptions());

	// This effect is responsible for telling the backend to parse the raws. It will go off
	// whenever the loadRaws signal is set to true. It will also reset the page to 1 and clear
	// the search string.
	// When the raws are done parsing, it will set the loadRaws signal to false, which will
	// enable it to be triggered again.
	createEffect(async () => {
		if (loadRaws() && settings.parsing.directoryPath.length > 0) {
			resetPage();
			searchContext.setSearchString("");
			await parseRaws();
			setLoadRaws(false);
		}
	});

	// The resource for raws which is exposed to the rest of the application.
	const [searchResults, { refetch }] = createResource(updateSearchResults, {
		name: "pageOfParsedRaws",
		initialValue: DEFAULT_SEARCH_RESULT,
	});

	// Effect to update the search results when the search options change
	createEffect(() => {
		// Only update if the search options have changed (deep compare) OR if the total results is 0 (optimistic update)
		if (
			searchResults.latest.totalResults === 0 ||
			JSON.stringify(searchContext.searchOptions()) !== JSON.stringify(previousSearchOptions())
		) {
			refetch();
		} else {
			console.log("Search options have not changed and were loaded before, skipping update.");
		}
	});

	// Signal to update the raw module info files data
	const [updateRawsInfo, setUpdateRawsInfo] = createSignal(false);
	/**
	 * Get raws' modules info.txt files from the backend.
	 *
	 * @returns The raws' modules info.txt files
	 */
	const [rawModulesInfo] = createResource(
		updateRawsInfo,
		async () => {
			const results = (await invoke(COMMAND_GET_RAWS_INFO)) as InfoFile[];
			return results;
		},
		{
			initialValue: [],
		},
	);

	// Signal for raw parsing progress
	const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>(DEFAULT_PARSING_STATUS);

	// Listen to window events from Tauri
	appWindow
		.listen(
			PARSING_PROGRESS_EVENT,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			({ event, payload }) => {
				const progress = payload as ProgressPayload;
				setParsingProgress(progress);
				// console.debug(payload);
			},
		)
		.then(() => {
			console.log("✓ Listening for progress updates from backend.");
		})
		.catch(console.error);

	// Signal for parsing summary
	const [summary, setSummary] = createSignal<Summary>(DEFAULT_SUMMARY);

	appWindow.listen(
		PARSING_SUMMARY_EVENT,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		({ event, payload }) => {
			const summary = payload as Summary;
			setSummary(summary);
		},
	);

	/**
	 * Function which tells the backend to parse the raws.
	 *
	 * @returns A promise which resolves when the raws are done parsing
	 */
	async function parseRaws(): Promise<void> {
		// Don't parse when not ready
		if (settings.ready !== true || settings.parsing.directoryPath === "") {
			console.info("Skipped parsing because settings are not initialized / the directory is not set");
			resetPage();
			// Reset the trigger after 50ms
			setTimeout(() => {
				setLoadRaws(false);
			}, 5);
			// EXIT EARLY
			return;
		}

		// Update parsing status
		setParsingStatus(STS_PARSING);

		try {
			// See the function in dfraw_json_parser/src/lib.rs for more info
			// The function in our lib.rs simply passes this through (more or less)
			const objectTypesToParse: ObjectType[] = [
				...settings.parsing.objectTypes,
				// Include graphics details
				"Graphics",
				"TilePage",
				// Include creature variations
				"CreatureVariation",
			];

			const parsingOptions: ParserOptions = {
				dwarfFortressDirectory: settings.parsing.directoryPath,
				attachMetadataToRaws: true,
				skipApplyCopyTagsFrom: false,
				skipApplyCreatureVariations: false,
				objectTypesToParse: objectTypesToParse,
				locationsToParse: settings.parsing.locations,
				legendsExportsToParse: settings.parsing.legendsExports,
				moduleInfoFilesToParse: settings.parsing.moduleInfoFiles,
				rawFilesToParse: settings.parsing.rawFiles,
				rawModulesToParse: settings.parsing.rawModules,
				logSummary: true,
			};

			// Have the backend parse the raws
			await invoke(COMMAND_PARSE_AND_STORE_RAWS, {
				options: parsingOptions,
			});

			// Update parsing status (reset it)
			setParsingProgress(DEFAULT_PARSING_STATUS);
			setParsingStatus(STS_IDLE);

			// Update the search results
			refetch();
			// Update the raw modules
			setUpdateRawsInfo(true);
		} catch (e) {
			console.error(e);
			setParsingProgress(DEFAULT_PARSING_STATUS);
			setParsingStatus(STS_EMPTY);
		}
	}

	/**
	 * Get raws from the backend and update the total results. This executes a search.
	 *
	 * @returns The search results
	 */
	async function updateSearchResults(): Promise<SearchResults> {
		const results = (await invoke(COMMAND_SEARCH_RAWS, {
			window: appWindow,
			searchOptions: searchContext.searchOptions(),
		})) as SearchResults;
		setTotalResults(results.totalResults);

		// Update the previous search options
		setPreviousSearchOptions(searchContext.searchOptions());

		return results;
	}

	// We can check if the directory is valid and if so, load the raws
	createEffect(() => {
		if (settings.parsing.directoryPath.length > 0 && settings.ready === true) {
			setLoadRaws(true);
		}
	});

	return {
		parsingStatus,
		setLoadRaws,
		parsingProgress,
		summary,
		rawModulesInfo,
		parsedRaws: searchResults,
	};
});
