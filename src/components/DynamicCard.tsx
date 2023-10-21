import { Component, Match, Switch } from 'solid-js';
import { Creature } from '../definitions/Creature';
import { Plant } from '../definitions/Plant';
import { Raw } from '../definitions/types';
import { nameForRaw } from '../lib/Raw';
import CreatureCard from './creature/CreatureCard';
import BotanicalCard from './plant/BotanicalCard';

const DynamicCard: Component<{ raw: Raw }> = (props) => {
  const listingId = props.raw.objectId + 'listing';

  return (
    <div class='card card-compact w-72 bg-neutral/25' id={listingId}>
      <Switch
        fallback={
          <div class='card-body'>
            <div class='flex flex-row'>
              <div class='flex-grow'>
                <div class='card-title'>{nameForRaw(props.raw)}</div>
                <div class='text-muted italic text-xs'>No match for {props.raw.metadata.objectType}</div>
              </div>
            </div>
          </div>
        }>
        <Match when={props.raw.metadata.objectType === 'Plant'}>
          <BotanicalCard plant={props.raw as unknown as Plant} />
        </Match>
        <Match when={props.raw.metadata.objectType === 'Creature'}>
          <CreatureCard creature={props.raw as unknown as Creature} />
        </Match>
        <Match when={props.raw.metadata.objectType === 'Entity'}>
          <></>
        </Match>
      </Switch>
    </div>
  );
};

export default DynamicCard;
