import { debounce } from '@solid-primitives/scheduled';
import { Button, Form } from 'solid-bootstrap';
import { IoOptionsSharp } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  return (
    <Show when={rawsContext.parsingStatus() === STS_IDLE}>
      <div class='hstack gap-2'>
        <div>
          <Button
            class='border-0 p-1'
            style={{ position: 'relative' }}
            variant='outline-primary'
            onClick={searchContext.handleToggleSearchFilters}>
            <IoOptionsSharp size={'1.5rem'} />
            <Show when={rawsContext.rawModuleFilters().length > 0}>
              <div class='badge-dot' />
            </Show>
          </Button>
        </div>
        <Form.Control
          type='search'
          placeholder='Type here to search'
          aria-label='Search'
          onInput={debounce((event: Event) => {
            const targetEl = event.target as HTMLInputElement;
            searchContext.setSearchString(targetEl.value.toLowerCase());
          }, 100)}
        />
      </div>
    </Show>
  );
};

export default SearchBox;
