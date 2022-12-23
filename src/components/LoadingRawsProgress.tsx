import { Spinner, Stack } from 'solid-bootstrap';
import { Component, Show } from 'solid-js';
import { STS_LOADING, useRawsProvider } from '../providers/RawsProvider';

const LoadingRawsProgress: Component = () => {
  const rawsContext = useRawsProvider();
  return (
    <Show when={rawsContext.parsingStatus() === STS_LOADING}>
      <Stack class='justify-content-center d-flex py-2' direction='horizontal' gap={3}>
        <Spinner animation='grow' />
        <span>Sorting, combining and loading raws...</span>
      </Stack>
    </Show>
  );
};

export default LoadingRawsProgress;
