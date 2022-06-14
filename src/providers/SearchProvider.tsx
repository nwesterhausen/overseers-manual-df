import { createContextProvider } from '@solid-primitives/context';
import { createSignal } from 'solid-js';

export const [SearchProvider, useSearchProvider] = createContextProvider(() => {
  // Signal for the search filter
  const [searchString, setSearchString] = createSignal('');
  return { searchString, setSearchString };
});
