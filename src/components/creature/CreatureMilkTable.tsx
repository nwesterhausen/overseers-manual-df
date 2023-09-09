import { Component, For } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { CasteRange, MilkableDesc } from '../../definitions/types';

const CreatureMilkTable: Component<{ values: CasteRange<MilkableDesc>; fallbackDesc: string }> = (props) => {
  const values = props.values;
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={Object.keys(values)} fallback={<p>{props.fallbackDesc}</p>}>
          {(caste) => (
            <tr>
              <td>{toTitleCase(caste)}</td>
              <td>
                Produces {values[caste].material} every {values[caste].frequency} ticks
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default CreatureMilkTable;
