import { Table } from 'solid-bootstrap';
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
    <Table class='m-0 p-0' size='sm' borderless>
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
    </Table>
  );
};

export default CreatureGrazerTable;
