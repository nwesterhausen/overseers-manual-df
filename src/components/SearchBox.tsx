import { Form, Spinner, Stack } from 'solid-bootstrap';
import { Component, Match, Switch } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';
import { STS_EMPTY, STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  return (
    <Switch>
      <Match when={rawsContext.currentStatus() === STS_EMPTY}>
        <></>
      </Match>
      <Match when={rawsContext.currentStatus() === STS_IDLE}>
        <Form.Control
          type='search'
          placeholder='Filter results'
          aria-label='Search'
          onInput={debounce((event) => {
            const targetEl = event.target as HTMLInputElement;
            searchContext.setSearchString(targetEl.value.toLowerCase());
          }, 100)}
        />
      </Match>
      <Match when={rawsContext.currentStatus() === STS_LOADING}>
        <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
          <Spinner animation='grow' />
          <span>Loading raws...</span>
        </Stack>
      </Match>
      <Match when={rawsContext.currentStatus() === STS_PARSING}>
        <Stack class='justify-content-center d-flex' gap={3}>
          <span>Parsing raw files...</span>
          {rawsContext.parsingProgressBar()}
        </Stack>
      </Match>
    </Switch>
  );
};

export default SearchBox;
