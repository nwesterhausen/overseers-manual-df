import { createContextProvider } from '@solid-primitives/context';
import { createMemo, createSignal } from 'solid-js';
import { SearchOptions } from '../definitions/SearchOptions';
import { useSettingsContext } from './SettingsProvider';

export const [SearchProvider, useSearchProvider] = createContextProvider(() => {
  const [settings] = useSettingsContext();
  // Signal for the search filter
  const [searchString, setSearchString] = createSignal('');
  const active = createMemo(() => searchString().length > 0);

  const [requireCreature, setRequireCreature] = createSignal(true);
  const handleToggleRequireCreature = () => {
    setRequireCreature(!requireCreature());
  };
  const [requirePlant, setRequirePlant] = createSignal(true);
  const handleToggleRequirePlant = () => {
    setRequirePlant(!requirePlant());
  };
  const [requireInorganic, setRequireInorganic] = createSignal(true);
  const handleToggleRequireInorganic = () => {
    setRequireInorganic(!requireInorganic());
  };
  const [requireEntity, setRequireEntity] = createSignal(true);
  const handleToggleRequireEntity = () => {
    setRequireEntity(!requireEntity());
  };

  // Required Modules (by objectId)
  const [filteredModules, setFilteredModules] = createSignal<string[]>([]);
  const addFilteredModule = (module: string | string[]) => {
    if (Array.isArray(module)) {
      setFilteredModules([...new Set([...filteredModules(), ...module])]);
      return;
    }

    if (filteredModules().indexOf(module) === -1) {
      setFilteredModules([...filteredModules(), module]);
    }
  };
  const removeFilteredModule = (module: string) => {
    if (filteredModules().indexOf(module) !== -1) {
      setFilteredModules(filteredModules().filter((v) => v !== module));
    }
  };
  const removeAllFilteredModules = () => {
    setFilteredModules([]);
  };

  // Required Tags
  const [requiredTags, setRequiredTags] = createSignal<string[]>([]);
  const addRequiredTag = (tag: string) => {
    if (requiredTags().indexOf(tag) === -1) {
      setRequiredTags([...requiredTags(), tag]);
    }
  };
  const removeRequiredTag = (tag: string) => {
    if (requiredTags().indexOf(tag) !== -1) {
      setRequiredTags(requiredTags().filter((v) => v !== tag));
    }
  };
  const removeAllRequiredTags = () => {
    setRequiredTags([]);
  };

  const advancedFiltering = createMemo(() => {
    return requiredTags().length + filteredModules().length > 0;
  });

  // Advanced Filtering Display Handling
  const [showAdvancedFilters, setShowAdvancedFilters] = createSignal(false);
  const handleShowAdvancedFilters = () => setShowAdvancedFilters(true);
  const handleHideAdvancedFilters = () => setShowAdvancedFilters(false);
  const handleToggleAdvancedFilters = () => setShowAdvancedFilters(!showAdvancedFilters());

  const searchOptions = createMemo<SearchOptions>(() => {
    const options: SearchOptions = {
      limit: settings.resultsPerPage,
      page: settings.currentPage,
      objectTypes: [],
      query: searchString(),
    };
    if (requireCreature()) {
      options.objectTypes.push('Creature');
    }
    if (requirePlant()) {
      options.objectTypes.push('Plant');
    }
    if (requireInorganic()) {
      options.objectTypes.push('Inorganic');
    }
    if (requireEntity()) {
      options.objectTypes.push('Entity');
    }

    // Todo: include advanced filtering options (modules and tags) once supported by the backend

    return options;
  });

  return {
    setSearchString,
    active,
    searchOptions,

    advancedFiltering,
    // Advanced Filtering Display Handling
    showAdvancedFilters,
    handleShowAdvancedFilters,
    handleHideAdvancedFilters,
    handleToggleAdvancedFilters,

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

    // Object Type Filtering
    requireCreature,
    handleToggleRequireCreature,
    requirePlant,
    handleToggleRequirePlant,
    requireInorganic,
    handleToggleRequireInorganic,
    requireEntity,
    handleToggleRequireEntity,
  };
});
