import { Accordion } from 'solid-bootstrap';
import { Component, Match, Switch } from 'solid-js';
import { Creature, DFInorganic, DFPlant, Raw } from '../definitions/types';
import CreatureAccordion from './creature/CreatureAccordion';
import InorganicAccordion from './inorganic/InorganicAccordion';
import BotanicalAccordion from './plant/BotanicalAccordion';

const DynamicAccordion: Component<{ raw: Raw }> = (props) => {
  const listingId = props.raw.objectId + 'listing';

  return (
    <Accordion.Item class='listing-accordion' eventKey={listingId}>
      <Switch fallback={<p>No match for {props.raw.rawType}</p>}>
        <Match when={props.raw.rawType === 'Plant'}>
          <BotanicalAccordion plant={props.raw as DFPlant} />
        </Match>
        <Match when={props.raw.rawType === 'Creature'}>
          <CreatureAccordion creature={props.raw as Creature} />
        </Match>
        <Match when={props.raw.rawType === 'Inorganic'}>
          <InorganicAccordion inorganic={props.raw as DFInorganic} />
        </Match>
      </Switch>
    </Accordion.Item>
  );
};

export default DynamicAccordion;
