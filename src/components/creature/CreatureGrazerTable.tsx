import { Component, For, Show } from 'solid-js';
import { Caste } from '../../definitions/Caste';
import { toTitleCase } from '../../definitions/Utils';

function rawToTiles(grazeVal: number): number {
  const mathTile = 20000 / grazeVal;
  if (mathTile >= 1) return Math.round(mathTile);
  return parseFloat(mathTile.toFixed(1));
}

const CreatureGrazerTable: Component<{ castes: Caste[]; fallbackDesc: string }> = (props) => {
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={props.castes} fallback={<p>{props.fallbackDesc}</p>}>
          {(caste) => (
            <Show when={caste.grazer}>
              <tr>
                <td>{toTitleCase(caste.identifier)}</td>
                <td>
                  Requires {rawToTiles(caste.grazer)} grazing tiles ({caste.grazer})
                </td>
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default CreatureGrazerTable;
