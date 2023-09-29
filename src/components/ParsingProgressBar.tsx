import { Component, Show, createMemo } from 'solid-js';
import { STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import { useSettingsContext } from '../providers/SettingsProvider';

const ParsingProgressBar: Component = () => {
  const rawsContext = useRawsProvider();
  const [settings] = useSettingsContext();
  const percentage = createMemo(() => {
    if (rawsContext.parsingStatus() === STS_PARSING) {
      return Math.floor(100 * rawsContext.parsingProgress().percentage);
    }
    return 0;
  });
  return (
    <Show when={rawsContext.parsingStatus() === STS_PARSING}>
      <div class='w-full p-5 flex flex-row'>
        <div class='basis-1/6'>
          <div
            class='radial-progress bg-primary text-primary-content border-4 border-primary'
            style={`--value:${percentage()};`}>
            {percentage()}%
          </div>
        </div>
        <div class='basis-2/6'>
          <div class='join join-vertical gap-1'>
            <div class='join-item'>
              <span class='badge bg-primary'>Location</span> {rawsContext.parsingProgress().currentLocation}
            </div>
            <div class='join-item'>
              <span class='badge bg-primary'>Module</span> {rawsContext.parsingProgress().currentModule}
            </div>
            <div class='join-item'>
              <span class='badge bg-primary'>File</span> {rawsContext.parsingProgress().currentFile}
            </div>
          </div>
        </div>
        <Show when={settings.includeLocationVanilla}>
          <div class='basis-1/6'>
            <div class='stat place-items-center'>
              <div class='stat-title'>Parsed Raws</div>
              <div class='stat-value'>
                {rawsContext.parsingProgress().runningTotal || <span class='loading loading-ring loading-xs'></span>}
              </div>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default ParsingProgressBar;
