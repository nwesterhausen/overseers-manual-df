import { Component, Show, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import { useSettingsContext } from '../providers/SettingsProvider';

const ParsingProgressBar: Component = () => {
  const rawsContext = useRawsProvider();
  const [_settings, { locationIncluded }] = useSettingsContext();
  const [progress, setProgress] = createStore({
    vanilla: false,
    installed: false,
    downloaded: false,
  });
  createEffect(() => {
    if (rawsContext.parsingStatus() === STS_PARSING) {
      if (rawsContext.parsingProgress().currentLocation === 'Vanilla') {
        setProgress('vanilla', true);
      }
      if (rawsContext.parsingProgress().currentLocation === 'InstalledMods') {
        setProgress('installed', true);
      }
      if (rawsContext.parsingProgress().currentLocation === 'Mods') {
        setProgress('downloaded', true);
      }
    } else {
      setProgress({
        vanilla: false,
        installed: false,
        downloaded: false,
      });
    }
  });
  return (
    <Show when={rawsContext.parsingStatus() === STS_PARSING}>
      <div class='flex flex-col'>
        <ul class='steps'>
          <li class='step step-success' data-context='✓'>
            Set Directory
          </li>
          <li
            class='step'
            classList={{
              'step-neutral': !locationIncluded('Vanilla', true),
              'step-success': progress.vanilla,
            }}
            data-content={locationIncluded('Vanilla', true) ? '2' : '✗'}>
            Parse Vanilla Raws
          </li>
          <li
            class='step'
            classList={{
              'step-neutral': !locationIncluded('InstalledMods', true),
              'step-success': progress.installed,
            }}
            data-content={locationIncluded('InstalledMods', true) ? '2' : '✗'}>
            Parse Installed Mods Raws
          </li>
          <li
            class='step'
            classList={{
              'step-neutral': !locationIncluded('Mods', true),
              'step-success': progress.downloaded,
            }}
            data-content={locationIncluded('Mods', true) ? '2' : '✗'}>
            Parse Downloaded Mods Raws
          </li>
          <li
            class='step'
            classList={{
              'step-success': rawsContext.parsingProgress().currentTask === 'PrepareLookups',
            }}>
            Build Search Index
          </li>
        </ul>
        <div class='flex justify-around pt-16'>
          <Show
            when={rawsContext.parsingProgress().currentTask !== 'PrepareLookups'}
            fallback={
              <div class='flex flex-row items-center'>
                <span class='loading loading-infinity loading-lg'></span>
                <span class='ms-4'>Building search lookups</span>
              </div>
            }>
            <span>Parsing {rawsContext.parsingProgress().currentModule}</span>
          </Show>
        </div>
      </div>
    </Show>
  );
};

export default ParsingProgressBar;
