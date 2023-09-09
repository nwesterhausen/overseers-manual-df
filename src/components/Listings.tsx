import { Component, For, Show } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import DynamicCard from './DynamicCard';
import Pagination from './menu/Pagination';

const Listings: Component = () => {
  const rawsContext = useRawsProvider();

  return (
    <Show
      when={rawsContext.parsingStatus() === STS_IDLE && rawsContext.searchFilteredRaws().length > 0}
      fallback={<div class='my-5 text-center text-neutral-700'>No results</div>}>
      <Pagination />
      <div class='flex flex-wrap justify-center gap-4'>
        <For each={rawsContext.searchFilteredRaws()}>{(raw) => <DynamicCard raw={raw} />}</For>
      </div>
      <Pagination />
    </Show>
  );
};

export default Listings;
