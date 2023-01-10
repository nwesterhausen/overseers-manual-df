import { Component, For } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import DynamicCard from './DynamicCard';

const Listings: Component = () => {
  const rawsContext = useRawsProvider();

  return (
    <div class='row justify-content-center gap-3'>
      <For
        each={rawsContext.searchFilteredRaws()}
        fallback={<div class='text-center fst-italic text-muted'>No results</div>}>
        {(raw) => <DynamicCard raw={raw} />}
      </For>
    </div>
  );
};

export default Listings;
