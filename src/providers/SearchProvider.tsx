import { createContextProvider } from '@solid-primitives/context';
import { createEffect, createSignal } from 'solid-js';

export const [SearchProvider, useSearchProvider] = createContextProvider(() => {
  // Signal for the search filter
  const [searchString, setSearchString] = createSignal('');
  // Signal for the advanced filter options
  const [showSearchFilters, setShowSearchFilters] = createSignal(false);
  const handleShowSearchFilters = () => setShowSearchFilters(true);
  const handleHideSearchFilters = () => setShowSearchFilters(false);
  const handleToggleSearchFilters = () => setShowSearchFilters(!showSearchFilters());

  // Signal for the tag filter
  const [showTagFilters, setShowTagFilters] = createSignal(false);
  const handleShowTagFilters = () => setShowTagFilters(true);
  const handleHideTagFilters = () => setShowTagFilters(false);
  const handleToggleTagFilters = () => setShowTagFilters(!showTagFilters());

  // Container for required tags
  const [requiredTagFilters, setRequiredTagFilters] = createSignal<string[]>([]);
  const addRequiredTagFilter = (tag: string) => {
    if (requiredTagFilters().indexOf(tag) === -1) {
      setRequiredTagFilters([...requiredTagFilters(), tag]);
    }
  };
  const removeRequiredTagFilter = (tag: string) => {
    if (requiredTagFilters().indexOf(tag) !== -1) {
      setRequiredTagFilters(requiredTagFilters().filter((v) => v !== tag));
    }
  };
  const removeAllRequiredTagFilters = () => {
    setRequiredTagFilters([]);
  }
  createEffect(() => {
    if (requiredTagFilters().length === 0) {
      console.debug("Required tags: None");
    } else {
      console.debug(`Required tags: ${requiredTagFilters().join(", ")}`);
    }
  })

  // Signal for the tag filter
  const [showCardDetails, setShowCardDetails] = createSignal(false);
  const handleShowCardDetails = () => setShowCardDetails(true);
  const handleHideCardDetails = () => setShowCardDetails(false);
  const handleToggleCardDetails = () => setShowCardDetails(!showCardDetails());

  return {
    searchString,
    setSearchString,
    // Module Filters
    showSearchFilters,
    handleHideSearchFilters,
    handleShowSearchFilters,
    handleToggleSearchFilters,
    // Tag filters
    showTagFilters,
    handleHideTagFilters,
    handleShowTagFilters,
    handleToggleTagFilters,
    // Tag filters data
    requiredTagFilters,
    addRequiredTagFilter,
    removeRequiredTagFilter,
    removeAllRequiredTagFilters,
    // Card Details Restriction
    showCardDetails,
    handleHideCardDetails,
    handleShowCardDetails,
    handleToggleCardDetails,
  };
});
