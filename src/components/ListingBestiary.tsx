import { Component, For, createMemo, createSignal } from 'solid-js';
import { isCreature } from '../definitions/Creature';
import type { Creature } from '../definitions/types';
import { useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';
import CreatureListing from './CreatureListing';

const ListingBestiary: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();

  const secretId = `list${Math.floor(Math.random() * 100)}`;

  // Filter the active key around
  const [activeKey, setActiveKey] = createSignal(`${secretId}-${rawsContext.creatureRawsAlphabet()[0]}`);
  const selectedLetter = createMemo(() => {
    return activeKey().split('-')[1];
  });

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
