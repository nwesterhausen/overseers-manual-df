import { debounce } from '@solid-primitives/scheduled';
import { Button, Form } from 'solid-bootstrap';
import { IoOptionsSharp } from 'solid-icons/io';
import { Component, Show, createMemo } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';

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

        <div>
          <Form.Check
            disabled={disabled()}
            onClick={searchContext.handleToggleRequireCreature}
            label="Creatures"
            checked
          />
        </div>
        <div>
          <Form.Check
            disabled={disabled()}
            onClick={searchContext.handleToggleRequirePlant}
            label="Plants"
            checked
          />
        </div>
        <div>
          <Form.Check
            disabled={disabled()}
            onClick={searchContext.handleToggleRequireInorganic}
            label="Inorganics"
            checked
          />
        </div>
        <Button
          disabled={disabled()}
          class='border-0 p-1 ms-1'
          style={{ position: 'relative' }}
          variant='outline-primary'
          onClick={searchContext.handleToggleAdvancedFilters}>
          <IoOptionsSharp size={'1.5rem'} />
          <span> Filter Raw Modules</span>
          <Show when={searchContext.advancedFiltering()}>
            <div class='badge-dot' />
          </Show>
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
