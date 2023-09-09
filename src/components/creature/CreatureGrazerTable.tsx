import { Component, For } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { CasteRange } from '../../definitions/types';

function rawToTiles(grazeVal: number): number {
  const mathTile = 20000 / grazeVal;
  if (mathTile >= 1) return Math.round(mathTile);
  return parseFloat(mathTile.toFixed(1));
}

const CreatureGrazerTable: Component<{ values: CasteRange<number>; fallbackDesc: string }> = (props) => {
  const values = props.values;
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={Object.keys(values)} fallback={<p>{props.fallbackDesc}</p>}>
          {(caste) => (
            <tr>
              <td>{toTitleCase(caste)}</td>
              <td>
                Requires {rawToTiles(values[caste])} grazing tiles ({values[caste]})
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default CreatureGrazerTable;
