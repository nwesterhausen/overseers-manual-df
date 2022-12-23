import { createContextProvider } from '@solid-primitives/context';
import { createSignal } from 'solid-js';

export const [SearchProvider, useSearchProvider] = createContextProvider(() => {
  // Signal for the search filter
  const [searchString, setSearchString] = createSignal('');
  // Signal for the advanced filter options
  const [showSearchFilters, setShowSearchFilters] = createSignal(false);
  const handleShowSearchFilters = () => setShowSearchFilters(true);
  const handleHideSearchFilters = () => setShowSearchFilters(false);
  const handleToggleSearchFilters = () => setShowSearchFilters(!showSearchFilters());
  return {
    searchString,
    setSearchString,
    showSearchFilters,
    handleHideSearchFilters,
    handleShowSearchFilters,
    handleToggleSearchFilters,
  };
});
