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
  return (
    <Show when={rawsContext.parsingStatus() === STS_PARSING}>
      <Stack class='justify-content-center d-flex' gap={3}>
        <div class='row align-items-start'>
          <div class='col'>{`${rawsContext.parsingProgress().currentTask} ${percentage()}% Completed`}</div>
          <div class='col'>Location {rawsContext.parsingProgress().currentLocation}</div>
          <div class='col'>Module {rawsContext.parsingProgress().currentModule}</div>
          <div class='col'>File {rawsContext.parsingProgress().currentFile}</div>
        </div>
        <Stack direction='vertical' gap={3}>
          <ProgressBar now={percentage()} animated />
        </Stack>
      </Stack>
    </Show>
  );
};

export default ParsingProgressBar;
