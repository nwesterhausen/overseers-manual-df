import { Component, Show } from 'solid-js';
import { Creature } from '../../definitions/Creature';
import {
  CanLearn,
  CanSpeak,
  CondensedEggSize,
  FirstPetValue,
  HasIntelligence,
  IsEggLayer,
  IsFlier,
  IsGnawer,
} from '../../lib/CreatureUtil';
import TwoPartBadge from '../TwoPartBadge';

const CreatureBadges: Component<{ creature: Creature }> = (props) => {
  return (
    <div>
      <div class='flex justify-content-center w-100 gap-1'>
        {/* EGG BADGE */}
        {IsEggLayer(props.creature) ? (
          <TwoPartBadge bg='primary' name='Egg' value={'' + CondensedEggSize(props.creature)} />
        ) : (
          <></>
        )}

        {/* FLIER BADGE */}
        {IsFlier(props.creature) ? <TwoPartBadge bg='primary' name='Flier' value={''} /> : <></>}

        {/* INTELLIGENCE BADGE */}
        {HasIntelligence(props.creature) ? (
          <TwoPartBadge bg='primary' name='Intelligent' value={''} />
        ) : (
          <>
            {CanLearn(props.creature) ? <TwoPartBadge bg='primary' name='Learns' value={''} /> : <></>}
            {CanSpeak(props.creature) ? <TwoPartBadge bg='primary' name='Speaks' value={''} /> : <></>}
          </>
        )}

        {/* GNAWER BADGE */}
        {IsGnawer(props.creature) ? <TwoPartBadge bg='primary' name='Gnawer' value={''} /> : <></>}

        {/* PET VALUE BADGE */}
        {FirstPetValue(props.creature) > 0 ? (
          <TwoPartBadge bg='primary' name='Pet' value={`${FirstPetValue(props.creature)}`} />
        ) : (
          <></>
        )}

        <Show when={Array.isArray(props.creature.tags) && props.creature.tags.length > 0}>
          {/* PLAYABLE BADGE */}
          {props.creature.tags.indexOf('LocalPopsProduceHeroes') === -1 ? (
            <></>
          ) : (
            <TwoPartBadge bg='primary' name='Playable' value={''} />
          )}

          {/* CIVILIZED BADGE */}
          {props.creature.tags.indexOf('LocalPopsControllable') === -1 ? (
            <></>
          ) : (
            <TwoPartBadge bg='primary' name='Civilized' value={''} />
          )}
        </Show>
      </div>
    </div>
  );
};

export default CreatureBadges;
