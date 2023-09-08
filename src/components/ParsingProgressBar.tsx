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
      <div class='w-4/6'>
        <div class='mt-3 gap-4 join'>
          <div
            class='radial-progress bg-primary text-primary-content border-4 border-primary'
            style={`--value:${percentage()};`}>
            {percentage()}%
          </div>
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
