import { Accordion } from 'solid-bootstrap';
import { Component, For, Show } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import { useSettingsContext } from '../providers/SettingsProvider';
import DynamicAccordion from './DynamicAccordion';
import DynamicCard from './DynamicCard';

const Listings: Component = () => {
  const rawsContext = useRawsProvider();
  const [settings] = useSettingsContext();

  return (
    <Show
      when={settings.displayStyleGrid}
      fallback={
        <Accordion class='ms-2 me-2'>
          <For
            each={rawsContext.searchFilteredRaws()}
            fallback={<div class='text-center fst-italic text-muted'>No results</div>}>
            {(raw) => <DynamicAccordion raw={raw} />}
          </For>
        </Accordion>
      }>
      <div class='row justify-content-center gap-3'>
        <For
          each={rawsContext.searchFilteredRaws()}
          fallback={<div class='text-center fst-italic text-muted'>No results</div>}>
          {(raw) => <DynamicCard raw={raw} />}
        </For>
      </div>
    </Show>
  );
};

export default Listings;
