import { Stack } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { CondensedEggSize, FirstPetValue, IsEggLayer } from '../../definitions/Creature';
import { Creature } from '../../definitions/types';
import TwoPartBadge from '../TwoPartBadge';

const CreatureBadges: Component<{ creature: Creature }> = (props) => {
  return (
    <div>
      <Stack class='d-flex justify-content-center w-100' direction='horizontal' gap={1}>
        {/* EGG BADGE */}
        {IsEggLayer(props.creature) ? (
          <TwoPartBadge bg='primary' name='Egg' value={'' + CondensedEggSize(props.creature.egg_sizes)} />
        ) : (
          <></>
        )}

        {/* FLIER BADGE */}
        {props.creature.flier.ALL ? <TwoPartBadge bg='primary' name='Flier' value={''} /> : <></>}

        {/* INTELLIGENCE BADGE */}
        {props.creature.intelligence.ALL && props.creature.intelligence.ALL[0] && props.creature.intelligence.ALL[1] ? (
          <TwoPartBadge bg='primary' name='Intelligent' value={''} />
        ) : (
          <>
            {props.creature.intelligence.ALL && props.creature.intelligence.ALL[0] ? (
              <TwoPartBadge bg='primary' name='Learns' value={''} />
            ) : (
              <></>
            )}
            {props.creature.intelligence.ALL && props.creature.intelligence.ALL[1] ? (
              <TwoPartBadge bg='primary' name='Speaks' value={''} />
            ) : (
              <></>
            )}
          </>
        )}

        {/* GNAWER BADGE */}
        {props.creature.gnawer.ALL ? <TwoPartBadge bg='primary' name='Gnawer' value={''} /> : <></>}

        {/* PET VALUE BADGE */}
        {FirstPetValue(props.creature) > 0 ? (
          <TwoPartBadge bg='primary' name='Pet' value={`${FirstPetValue(props.creature)}`} />
        ) : (
          <></>
        )}

        {/* PLAYABLE BADGE */}
        {props.creature.tags.indexOf('LOCAL_POPS_CONTROLLABLE') === -1 ? (
          <></>
        ) : (
          <TwoPartBadge bg='primary' name='Playable' value={''} />
        )}

        {/* CIVILIZED BADGE */}
        {props.creature.tags.indexOf('LOCAL_POPS_CONTROLLABLE') === -1 ? (
          <></>
        ) : (
          <TwoPartBadge bg='primary' name='Civilized' value={''} />
        )}
      </Stack>
    </div>
  );
};

export default CreatureBadges;
