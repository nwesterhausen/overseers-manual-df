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
  const selectedLetter = createMemo(() => {
    return activeKey().split('-')[1];
  });
  const realizedActiveKey = createMemo(() => {
    const currKey: string = activeKey().split('-')[1];
    if (alphaHeadings().indexOf(currKey) === -1 && currKey !== 'all') {
      return `${secretid}-${alphaHeadings()[0]}`;
    }
    return activeKey();
  });

  return (
    <Tab.Container
      mountOnEnter
      id={secretid}
      defaultActiveKey={realizedActiveKey()}
      activeKey={realizedActiveKey()}
      onSelect={(key) => {
        console.log('selected', key);
        setActiveKey(key);
        console.log(realizedActiveKey(), selectedLetter());
      }}>
      <AlphaLinks alphabet={alphaHeadings()} id={secretid} />
      {listingList().length > 0 ? (
        <Tab.Content>
          <For each={alphaHeadings()}>
            {(letter) => (
              <Tab.Pane eventKey={`${secretid}-${letter}`}>
                <Accordion flush>
                  {letter === selectedLetter() ? (
                    <For
                      each={listingList().filter((v) => v.name.toLowerCase().startsWith(letter))}
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
          <Tab.Pane eventKey={`${secretid}-all`}>
            <Accordion flush>
              {'all' === selectedLetter() ? (
                <For each={listingList()} fallback={<div>No items</div>}>
                  {(raw) => (isCreature(raw) ? <CreatureListing creature={raw as Creature} /> : '')}
                </For>
              ) : (
                <></>
              )}
            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      ) : (
        <p class='text-center'>No results matching "{props.searchString}"</p>
      )}
    </Tab.Container>
  );
};

export default Listing;
