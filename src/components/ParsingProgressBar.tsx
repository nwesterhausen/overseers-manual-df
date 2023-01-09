import { ProgressBar, Stack } from 'solid-bootstrap';
import { Component, Show, createMemo } from 'solid-js';
import { STS_PARSING, useRawsProvider } from '../providers/RawsProvider';

const ParsingProgressBar: Component = () => {
  const rawsContext = useRawsProvider();
  const percentage = createMemo(() => {
    if (rawsContext.parsingStatus() === STS_PARSING) {
      return Math.floor(100 * rawsContext.parsingProgress().percentage);
    }
    return 0;
  });
  const current = createMemo(() => {
    return rawsContext.parsingProgress().currentModule;
  });
  return (
    <Show when={rawsContext.parsingStatus() === STS_PARSING}>
      <Stack class='justify-content-center d-flex' gap={3}>
        <span>Parsing raw files...</span>
        <Stack direction='vertical' gap={3}>
          <ProgressBar now={percentage()} animated />
          <p class='text-center'>{`${percentage()}% ...parsing "${current()}"`}</p>
        </Stack>
      </Stack>
    </Show>
  );
};

export default ParsingProgressBar;
