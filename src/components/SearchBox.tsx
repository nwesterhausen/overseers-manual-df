import { debounce } from '@solid-primitives/scheduled';
import { Form, Spinner, Stack } from 'solid-bootstrap';
import { Component, Match, Switch } from 'solid-js';
import { STS_EMPTY, STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';
import ParsingProgressBar from './ParsingProgressBar';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  return (
    <Switch>
      <Match when={rawsContext.parsingStatus() === STS_EMPTY}>
        <></>
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_IDLE}>
        <Form.Control
          type='search'
          placeholder='Filter results'
          aria-label='Search'
          onInput={debounce((event: Event) => {
            const targetEl = event.target as HTMLInputElement;
            searchContext.setSearchString(targetEl.value.toLowerCase());
          }, 100)}
        />
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_LOADING}>
        <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
          <Spinner animation='grow' />
          <span>Loading raws...</span>
        </Stack>
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_PARSING}>
        <Stack class='justify-content-center d-flex' gap={3}>
          <span>Parsing raw files...</span>
          <ParsingProgressBar />
        </Stack>
      </Match>
    </Switch>
  );
};

export default SearchBox;
