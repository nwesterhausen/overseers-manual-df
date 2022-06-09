import { Accordion } from 'solid-bootstrap';
import { Component, createMemo, For } from 'solid-js';
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
  // const [pages, setPages] = createSignal([]);
  const secretid = `list${Math.floor(Math.random() * 100)}`;
  return (
    <>
      <AlphaLinks alphabet={alphaHeadings()} id={secretid} />
      <ul class='list-unstyled'>
        <For each={alphaHeadings()}>
          {(letter) => (
            <li>
              <span id={`${secretid}-${letter}`} class='bolder fs-3 listing-letter'>
                {letter.toUpperCase()}
              </span>
              <Accordion flush>
                <For
                  each={listingList().filter((v) => v.name.toLowerCase().startsWith(letter))}
                  fallback={<div>No items</div>}>
                  {(raw) => (isCreature(raw) ? <CreatureListing item={raw as Creature} /> : '')}
                </For>
              </Accordion>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default Listing;
