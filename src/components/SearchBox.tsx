import { debounce } from '@solid-primitives/scheduled';
import { Form } from 'solid-bootstrap';
import { Component, Show } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  return (
    <Show when={rawsContext.parsingStatus() === STS_IDLE}>
      <Form.Control
        type='search'
        placeholder='Filter results'
        aria-label='Search'
        onInput={debounce((event: Event) => {
          const targetEl = event.target as HTMLInputElement;
          searchContext.setSearchString(targetEl.value.toLowerCase());
        }, 100)}
      />
    </Show>
  );
};

export default SearchBox;
