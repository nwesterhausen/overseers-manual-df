import { ProgressBar, Stack } from 'solid-bootstrap';
import { Component, createMemo } from 'solid-js';
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
    return rawsContext.parsingProgress().current_module;
  });
  return (
    <Stack direction='vertical' gap={3}>
      <ProgressBar now={percentage()} animated />
      <p class='text-center'>{`${percentage()}% ...parsing "${current()}"`}</p>
    </Stack>
  );
};

export default ParsingProgressBar;
