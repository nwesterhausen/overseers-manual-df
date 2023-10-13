import { Component, For } from 'solid-js';
import { Creature } from '../../definitions/Creature';
import { ActiveTimeStatus, NoSeasonStatus } from '../../definitions/CreatureUtil';
import { toTitleCase } from '../../definitions/Utils';

const CreatureActivityDisplay: Component<{ creature: Creature }> = (props) => {
  const seasonActivity = CondenseInactiveSeasons(props.creature);
  const dayActivity = CondenseActiveTimes(props.creature);

  return (
    <div class='join join-vertical'>
      <For each={seasonActivity} fallback={<span>No known seasonal activity</span>}>
        {(activity) => <span>{activity}</span>}
      </For>
      <For each={dayActivity} fallback={<span>No known daily activity</span>}>
        {(activity) => <span>{activity}</span>}
      </For>
    </div>
  );
};

export default CreatureActivityDisplay;

const CondenseInactiveSeasons = (creature: Creature): string[] => {
  // Multiple sets of season activity based on caste
  const strArr: string[] = [];
  for (const caste of creature.castes) {
    strArr.push(`${toTitleCase(caste.identifier)}: ${NoSeasonStatus(caste)}`);
  }
  return strArr;
};

const CondenseActiveTimes = (creature: Creature): string[] => {
  // Multiple sets of season activity based on caste
  const strArr: string[] = [];
  for (const caste of creature.castes) {
    strArr.push(`${toTitleCase(caste.identifier)}: ${ActiveTimeStatus(caste)}`);
  }
  return strArr;
};
