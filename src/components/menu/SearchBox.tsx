import { debounce } from '@solid-primitives/scheduled';
import { Component, createMemo } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../../providers/RawsProvider';
import { useSearchProvider } from '../../providers/SearchProvider';
import AdvancedFiltersButton from './AdvancedFiltersButton';
import RawTypeCheckboxes from './RawTypeCheckboxes';
import TagRestrictionButton from './TagRestrictionButton';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();

  const disabled = createMemo(() => rawsContext.parsingStatus() !== STS_IDLE);

  return (
    <div class='m-2'>
      <div class='hstack gap-2'>
        <div>
          <input
            disabled={disabled()}
            class='form-control'
            id='search-box'
            type='search'
            placeholder='Type here to search'
            aria-label='Search'
            onInput={debounce((event: Event) => {
              const targetEl = event.target as HTMLInputElement;
              searchContext.setSearchString(targetEl.value.toLowerCase());
            }, 100)}
          />
        </div>

        <RawTypeCheckboxes disabled={disabled()} />
        <TagRestrictionButton disabled={disabled()} />
        <AdvancedFiltersButton disabled={disabled()} />
      </div>
    </div>
  );
};

export default SearchBox;
