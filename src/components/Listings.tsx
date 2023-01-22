import { Accordion } from 'solid-bootstrap';
import { Component, For, Show } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import { useSettingsContext } from '../providers/SettingsProvider';
import DynamicAccordion from './DynamicAccordion';
import DynamicCard from './DynamicCard';
import Pagination from './menu/Pagination';

const Listings: Component = () => {
  const rawsContext = useRawsProvider();
  const [settings] = useSettingsContext();

  return (
    <Show
      when={rawsContext.parsingStatus() === STS_IDLE && rawsContext.searchFilteredRaws().length > 0}
      fallback={<div class='my-5 text-center fst-italic text-muted'>No results</div>}>
      <Pagination />
      <Show
        when={settings.displayStyleGrid}
        fallback={
          <Accordion class='ms-2 me-2'>
            <For each={rawsContext.searchFilteredRaws()}>{(raw) => <DynamicAccordion raw={raw} />}</For>
          </Accordion>
        }>
        <div class='row justify-content-center gap-3'>
          <For each={rawsContext.searchFilteredRaws()}>{(raw) => <DynamicCard raw={raw} />}</For>
        </div>
      </Show>
      <Pagination />
    </Show>
  );
};

export default Listings;
