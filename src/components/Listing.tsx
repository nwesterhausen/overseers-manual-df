import { Accordion, Tab } from 'solid-bootstrap';
import { Component, createMemo, createSignal, For } from 'solid-js';
import { Creature, isCreature } from '../definitions/Creature';
import { Raw, RawsFirstLetters } from '../definitions/Raw';
import AlphaLinks from './AlphaLinks';
import CreatureListing from './CreatureListing';

const Listing: Component<{ data: Raw[]; searchString: string }> = (props) => {
  // Perform the filter on the data we have.
  const listingList = createMemo((): Raw[] => {
    return props.data.filter((raw) => {
      return (
        // Filter the object based on the searchableString value
        raw.searchString && raw.searchString.indexOf(props.searchString) !== -1
      );
    });
  });
  // The alphabet but only the letters for which we have entries.
  const alphaHeadings = createMemo(() => {
    return RawsFirstLetters(listingList() as Raw[]);
  });
  const secretid = `list${Math.floor(Math.random() * 100)}`;

  // Filter the active key around
  const [activeKey, setActiveKey] = createSignal(`${secretid}-${alphaHeadings()[0]}`);
  const realizedActiveKey = createMemo(() => {
    const currKey: string = activeKey().split('-')[1];
    if (alphaHeadings().indexOf(currKey) === -1) {
      return `${secretid}-${alphaHeadings()[0]}`;
    }
    return activeKey();
  });

  return (
    <Tab.Container
      mountOnEnter={true}
      id={secretid}
      defaultActiveKey={`${secretid}-${alphaHeadings()[0]}`}
      activeKey={realizedActiveKey()}
      onSelect={(key) => {
        setActiveKey(key);
      }}>
      <AlphaLinks alphabet={alphaHeadings()} id={secretid} />
      <Tab.Content>
        <For each={alphaHeadings()}>
          {(letter) => (
            <Tab.Pane eventKey={`${secretid}-${letter}`}>
              <Accordion flush>
                <For
                  each={listingList().filter((v) => v.name.toLowerCase().startsWith(letter))}
                  fallback={<div>No items</div>}>
                  {(raw) => (isCreature(raw) ? <CreatureListing creature={raw as Creature} /> : '')}
                </For>
              </Accordion>
            </Tab.Pane>
          )}
        </For>
      </Tab.Content>
    </Tab.Container>
  );
};

export default Listing;
