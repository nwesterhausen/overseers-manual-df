import { Component, For } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import CreatureCard from './creature/CreatureCard';

const ListingBestiary: Component = () => {
  const rawsContext = useRawsProvider();

  return (
    <div class='row justify-content-center gap-3'>
      <For
        each={rawsContext.creatureRaws()}
        fallback={<div class='text-center fst-italic text-muted'>No matches in the Bestiary</div>}>
        {(raw) => <CreatureCard creature={raw} />}
      </For>
    </div>
  );
};

export default ListingBestiary;
