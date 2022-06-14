import { Container, Form, Button, Spinner, Stack } from 'solid-bootstrap';
import { Component, For, Match, Switch } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';
import { STS_EMPTY, STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import { useDirectoryProvider } from '../providers/DirectoryProvider';
import { useSearchProvider } from '../providers/SearchProvider';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const directoryContext = useDirectoryProvider();
  const searchContext = useSearchProvider();
  if (directoryContext.saveFolderPath().length == 0) {
    return <></>;
  }
  return (
    <Switch>
      <Match when={rawsContext.parsingStatus() === STS_IDLE}>
        {rawsContext.jsonRawsResource().length === 0 ? (
          <>
            <p class='text-center'>Please choose a save to load raws from:</p>
            <Container class='justify-content-center d-flex mx-auto w-50'>
              <Stack gap={1}>
                <For each={directoryContext.saveDirectoryOptions()}>
                  {(dir) => (
                    <Button onClick={() => directoryContext.setCurrentSave(dir)} variant='outline-secondary'>
                      {dir}
                    </Button>
                  )}
                </For>
              </Stack>
            </Container>
          </>
        ) : (
          <>
            <Form.Control
              type='search'
              placeholder='Filter results'
              aria-label='Search'
              onInput={debounce((event) => {
                const targetEl = event.target as HTMLInputElement;
                searchContext.setSearchString(targetEl.value.toLowerCase());
              }, 100)}
            />
          </>
        )}
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_LOADING}>
        <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
          <Spinner animation='grow' />
          <span>Loading raws...</span>
        </Stack>
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_PARSING}>
        <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
          <Spinner animation='grow' />
          <span>Parsing raw files...</span>
        </Stack>
      </Match>
      <Match when={rawsContext.parsingStatus() === STS_EMPTY}>
        <>
          <p class='text-center'>
            No raws found in <strong>{directoryContext.currentSave()}</strong>
          </p>
          <p class='text-center'>Please choose a save to load raws from:</p>
          <Container class='justify-content-center d-flex mx-auto w-50'>
            <Stack gap={1}>
              <For each={directoryContext.saveDirectoryOptions()}>
                {(dir) => (
                  <Button onClick={() => directoryContext.setCurrentSave(dir)} variant='outline-secondary'>
                    {dir}
                  </Button>
                )}
              </For>
            </Stack>
          </Container>
        </>
      </Match>
    </Switch>
  );
};

export default SearchBox;
