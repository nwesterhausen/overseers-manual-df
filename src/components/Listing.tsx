import { Accordion, Tab, Tabs } from 'solid-bootstrap';
import { Component, createMemo, createSignal, For } from 'solid-js';
import { Creature } from '../classes/Creature';
import { Raw } from '../classes/Raw';

const ArrayToAlphabet = (arr: Raw[]) => {
  return [
    ...new Set(
      arr.map((v: Raw) => {
        const name = v.names[0];
        if (name.length) {
          return name.charAt(0);
        }
        return '';
      })
    ),
  ].sort();
};

const eggLayingStatus = (creature: Creature): string => {
  if (!creature.lays_eggs) {
    return "Doesn't lay eggs.";
  }
  const keys = Object.keys(creature.clutch_size);
  if (keys.length === 0) {
    return 'Lays an unknown quantity of eggs.';
  }
  let ret = '';
  for (let k in creature.clutch_size) {
    ret += `${k} lays ${creature.clutch_size[k].join(' - ')} eggs.`;
  }
  return ret;
};

const maxAgeStatus = (creature: Creature): string => {
  const keys = Object.keys(creature.max_age);
  if (keys.length === 0) {
    return 'Lives indefinitely.';
  }
  if (keys.length === 1) {
    return `Live ${creature.max_age[keys[0]].join(' - ')} years.`;
  }
  let ret = '';
  for (let c in creature.max_age) {
    ret += `${c} lives ${creature.max_age[c].join(' - ')} years.`;
  }
  return ret;
};

const Listing: Component<{ data: Creature[]; searchString: string }> = (props) => {
  const listingList = createMemo(() => {
    return props.data.filter((creature) => {
      return (
        // check if the search string is in the name
        creature.names.join('*').includes(props.searchString) ||
        // check if the search string is in the name
        creature.description.includes(props.searchString) ||
        // check if the search string is egg(s) to display all egg_layers
        ((props.searchString.toLowerCase() === 'egg' || props.searchString.toLowerCase() === 'eggs') &&
          creature.lays_eggs)
      );
    });
  });
  const alphaHeadings = createMemo(() => {
    return ArrayToAlphabet(listingList() as Raw[]);
  });
  // const [pages, setPages] = createSignal([]);
  return (
    <ul class='list-unstyled'>
      <For each={alphaHeadings()}>
        {(letter) => (
          <li>
            <strong class='fs-3'>{letter.toUpperCase()}</strong>
            <Accordion flush>
              <For each={listingList().filter((v) => v.names[0].startsWith(letter))} fallback={<div>No items</div>}>
                {(item, i) => (
                  <Accordion.Item eventKey={item.objectId + 'accordian'}>
                    <Accordion.Header>{item.names[0]}</Accordion.Header>
                    <Accordion.Body>
                      <Tabs defaultActiveKey={`${item.objectId}-data`} class='mb-2'>
                        <Tab eventKey={`${item.objectId}-data`} title='Description'>
                          <p class='text-muted'>{item.names.join(', ')}</p>
                          <p>{item.description}</p>
                          <ul class='list-group list-group-flush'>
                            <li class='list-group-item'>{maxAgeStatus(item)}</li>
                            <li class='list-group-item'>{eggLayingStatus(item)}</li>
                          </ul>
                        </Tab>
                        <Tab eventKey={`${item.objectId}-raws`} title='Raws'>
                          <h5>Identifiers</h5>
                          <p>
                            Rawfile: <strong>{item.parent_raw}</strong>
                          </p>
                          <p>
                            ID: <strong>{item.identifier}</strong>
                          </p>
                          <h5>Simplified (Parsed) Raw Data</h5>
                          <pre>{JSON.stringify(item, null, 2)}</pre>
                        </Tab>
                      </Tabs>
                    </Accordion.Body>
                  </Accordion.Item>
                )}
              </For>
            </Accordion>
          </li>
        )}
      </For>
    </ul>
  );
};

export default Listing;
