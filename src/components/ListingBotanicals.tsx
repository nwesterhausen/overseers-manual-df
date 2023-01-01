import { Component, For } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import BotanicalCard from './BotanicalCard';

const ListingBotanicals: Component = () => {
  const rawsContext = useRawsProvider();

  return (
    <div class='row justify-content-center gap-3'>
      <For
        each={rawsContext.plantRaws()}
        fallback={<div class='text-center fst-italic text-muted'>No matches in the Bestiary</div>}>
        {(raw) => <BotanicalCard plant={raw} />}
      </For>
    </div>
  );
};

export default ListingBotanicals;
