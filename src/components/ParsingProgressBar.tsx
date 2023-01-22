import { ProgressBar } from 'solid-bootstrap';
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
      <div class='justify-content-center d-flex vstack'>
        <div class='mt-3 gap-3 vstack'>
          <ProgressBar now={percentage()} animated />
          <div class='row progress-details'>
            <div class='col-auto'>
              <span class='badge bg-primary'>Location</span> {rawsContext.parsingProgress().currentLocation}
            </div>
            <div class='col-auto'>
              <span class='badge bg-primary'>Module</span> {rawsContext.parsingProgress().currentModule}
            </div>
            <div class='col-auto'>
              <span class='badge bg-primary'>File</span> {rawsContext.parsingProgress().currentFile}
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default ParsingProgressBar;
