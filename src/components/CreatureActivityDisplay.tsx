import { Stack } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { ActiveTimeStatus, CasteRange, Creature, NoSeasonStatus } from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';

const CreatureActivityDisplay: Component<{ creature: Creature }> = (props) => {
  const seasonActivity = CondenseInactiveSeasons(props.creature.inactive_season);
  const dayActivity = CondenseActiveTimes(props.creature.active_time);

  return (
    <Stack>
      <For each={seasonActivity} fallback={<span>No known seasonal activity</span>}>
        {(activity) => <span>{activity}</span>}
      </For>
      <For each={dayActivity} fallback={<span>No known daily activity</span>}>
        {(activity) => <span>{activity}</span>}
      </For>
    </Stack>
  );
};

export default CreatureActivityDisplay;

const CondenseInactiveSeasons = (inactiveSeasons: CasteRange<number>): string[] => {
  const keys = Object.keys(inactiveSeasons);
  if (keys.length > 1) {
    // Multiple sets of season activity based on caste
    const strarr: string[] = [];
    for (const k of keys) {
      strarr.push(`${toTitleCase(k)}: ${NoSeasonStatus(inactiveSeasons[k])}`);
    }
    return strarr;
  }
  if (keys.length === 0) {
    return [];
  }
  return [NoSeasonStatus(inactiveSeasons[keys[0]])];
};
const CondenseActiveTimes = (inactiveSeasons: CasteRange<number>): string[] => {
  const keys = Object.keys(inactiveSeasons);
  if (keys.length > 1) {
    // Multiple sets of season activity based on caste
    const strarr: string[] = [];
    for (const k of keys) {
      strarr.push(`${toTitleCase(k)}: ${ActiveTimeStatus(inactiveSeasons[k])}`);
    }
    return strarr;
  }
  if (keys.length === 0) {
    return [];
  }
  return [ActiveTimeStatus(inactiveSeasons[keys[0]])];
};
