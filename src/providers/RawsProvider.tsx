import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { ProgressBar } from 'solid-bootstrap';
import { createEffect, createMemo, createResource, createSignal, JSX } from 'solid-js';
import { AssignBasedOn, GenerateSearchString } from '../definitions/Creature';
import { FilterInvalidRaws, RawsFirstLetters } from '../definitions/Raw';
import type { Creature, Raw } from '../definitions/types';
import { useDirectoryProvider } from './DirectoryProvider';
import { useSearchProvider } from './SearchProvider';

// Statuses for the parsing status
export const STS_PARSING = 'Parsing Raws',
  STS_LOADING = 'Loading Raws',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const directoryContext = useDirectoryProvider();
  const searchContext = useSearchProvider();

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Log the effect changes
  createEffect(() => {
    console.log(parsingStatus());
  });

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [jsonRawsResource] = createResource(loadRaws, parseRaws, {
    initialValue: [],
  });

  // Raws after filtering by the search
  const rawsJson = createMemo(() => {
    if (searchContext.searchString() === '') {
      return jsonRawsResource();
    }
    const searchTerms = searchContext.searchString().split(' ');
    return jsonRawsResource().filter((raw) => {
      return (
        // Filter the object based on the searchableString value
        raw.searchString &&
        searchTerms.filter((v) => {
          for (const term of raw.searchString) {
            if (term.indexOf(v.toLowerCase()) !== -1) return true;
          }
          return false;
        }).length === searchTerms.length
      );
    });
  });

  // The alphabet but only the letters for which we have entries.
  const rawsAlphabet = createMemo((): string[] => {
    return RawsFirstLetters(rawsJson() as Raw[]);
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal(100);
  const parsingProgressBar = createMemo((): JSX.Element => {
    const percentage = Math.floor(100 * parsingProgress());
    return <ProgressBar now={percentage} label={`${percentage}%`} />;
  });

  // Signal no set directory
  createEffect(() => {
    if (directoryContext.directoryPath().length === 0) {
      setParsingStatus(STS_EMPTY);
    } else {
      setLoadRaws(true);
    }
  });

  async function parseRaws(): Promise<Creature[]> {
    const dir = directoryContext.directoryPath().join("/");

    setParsingProgress(0);
    setParsingStatus(STS_PARSING);

    try {
      const raw_file_data: Creature[][] = JSON.parse(await invoke('parse_raws_at_game_path', { path: dir }));

      setParsingProgress(100);
      setParsingStatus(STS_LOADING);

      // Flatten the array of arrays
      const result = raw_file_data.flat();

      // Sort all raws by name
      const sortResult = result.filter(FilterInvalidRaws).sort((a, b) => (a.name < b.name ? -1 : 1));

      // Loop over all sorted raws
      for (let i = 0; i < sortResult.length; i++) {
        // Assume its a creature raw (all we handle right now)
        const val: Creature = sortResult[i];
        // If its based on another raw, find it and apply it
        if (val.based_on && val.based_on.length) {
          const matches = sortResult.filter((c) => c.objectId === val.based_on);
          if (matches.length === 1) {
            sortResult[i] = AssignBasedOn(val, matches[0]);
          } else {
            console.warn(`${matches.length} matches for 'based_on':${val.based_on}`);
          }
        }
        // Build a search string for the raw
        sortResult[i].searchString = GenerateSearchString(sortResult[i]);
      }

      // Based on the number of results, set raws as EMPTY or IDLE
      if (sortResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }

      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);

      return sortResult;
    } catch (e) {
      console.error(e);
      setParsingProgress(100);
      setParsingStatus(STS_EMPTY);
    }
  }

  return { currentStatus: parsingStatus, rawsJson, setLoadRaws, parsingProgressBar, rawsAlphabet };
});
