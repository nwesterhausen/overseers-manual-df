import { Accordion } from 'solid-bootstrap';
import { Component, For, Show } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import { useSettingsContext } from '../providers/SettingsProvider';
import DynamicAccordion from './DynamicAccordion';
import DynamicCard from './DynamicCard';
import Pagination from './menu/Pagination';

const Listings: Component = () => {
  const rawsContext = useRawsProvider();
  const [settings] = useSettingsContext();

  return (
    <>
      <Pagination />
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
      <Pagination />
    </>
  );
};

export default Listings;
