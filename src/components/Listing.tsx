import { Accordion, Tab } from 'solid-bootstrap';
import { Component, createMemo, createSignal, For } from 'solid-js';
import { isCreature } from '../definitions/Creature';
import type { Creature } from '../definitions/types';
import { useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';
import AlphaLinks from './AlphaLinks';
import CreatureListing from './CreatureListing';

const Listing: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();

  const secretId = `list${Math.floor(Math.random() * 100)}`;

  // Filter the active key around
  const [activeKey, setActiveKey] = createSignal(`${secretId}-${rawsContext.rawsAlphabet()[0]}`);
  const selectedLetter = createMemo(() => {
    return activeKey().split('-')[1];
  });

  return (
    <Tab.Container
      mountOnEnter
      id={secretId}
      defaultActiveKey={secretId + '-' + rawsContext.rawsAlphabet()[0]}
      onSelect={(key) => {
        setActiveKey(key);
      }}>
      <AlphaLinks id={secretId} />
      {rawsContext.rawsJson().length > 0 ? (
        <Tab.Content>
          <For each={rawsContext.rawsAlphabet()}>
            {(letter) => (
              <Tab.Pane eventKey={`${secretId}-${letter}`}>
                <Accordion flush>
                  {letter === selectedLetter() ? (
                    <For
                      each={rawsContext.rawsJson().filter((v) => v.name.toLowerCase().startsWith(letter))}
                      fallback={<div>No items</div>}>
                      {(raw) => (isCreature(raw) ? <CreatureListing creature={raw as Creature} /> : '')}
                    </For>
                  ) : (
                    <></>
                  )}
                </Accordion>
              </Tab.Pane>
            )}
          </For>
          <Tab.Pane eventKey={`${secretId}-all`}>
            <Accordion flush>
              {'all' === selectedLetter() ? (
                <For each={rawsContext.rawsJson()} fallback={<div>No items</div>}>
                  {(raw) => (isCreature(raw) ? <CreatureListing creature={raw as Creature} /> : '')}
                </For>
              ) : (
                <></>
              )}
            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      ) : (
        <p class='text-center'>No results matching "{searchContext.searchString()}"</p>
      )}
    </Tab.Container>
  );
};

export default Listing;
