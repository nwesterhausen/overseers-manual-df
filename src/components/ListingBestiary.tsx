import { Component, For } from 'solid-js';
import { isCreature } from '../definitions/Creature';
import type { Creature } from '../definitions/types';
import { useRawsProvider } from '../providers/RawsProvider';
import CreatureListing from './CreatureListing';

const ListingBestiary: Component = () => {
  const rawsContext = useRawsProvider();

  return (
    <div class='row justify-content-center gap-3'>
      <For
        each={rawsContext.creatureRaws()}
        fallback={<div class='text-center fst-italic text-muted'>No matches in the Bestiary</div>}>
        {(raw) => (isCreature(raw) ? <CreatureListing creature={raw as Creature} /> : '')}
      </For>
    </div>
  );
};

export default ListingBestiary;
