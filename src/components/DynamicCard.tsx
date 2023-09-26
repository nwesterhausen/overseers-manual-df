import { Component, Match, Switch } from 'solid-js';
import { DFCreature } from '../definitions/DFCreature';
import { DFPlant } from '../definitions/DFPlant';
import { Raw } from '../definitions/types';
import CreatureCard from './creature/CreatureCard';
import BotanicalCard from './plant/BotanicalCard';

const DynamicCard: Component<{ raw: Raw }> = (props) => {
  const listingId = props.raw.objectId + 'listing';

  return (
    <div class='card card-compact w-72 bg-neutral/25' id={listingId}>
      <Switch fallback={<p>No match for {props.raw.metadata.objectType}</p>}>
        <Match when={props.raw.metadata.objectType === 'Plant'}>
          <BotanicalCard plant={props.raw as unknown as DFPlant} />
        </Match>
        <Match when={props.raw.metadata.objectType === 'Creature'}>
          <CreatureCard creature={props.raw as unknown as DFCreature} />
        </Match>
      </Switch>
    </div>
  );
};

export default DynamicCard;
