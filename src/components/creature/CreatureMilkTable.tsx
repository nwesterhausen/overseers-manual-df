import { Component, For, Show } from 'solid-js';
import { DFCaste } from '../../definitions/DFCaste';
import { toTitleCase } from '../../definitions/Utils';

const CreatureMilkTable: Component<{ values: DFCaste[]; fallbackDesc: string }> = (props) => {
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={props.values} fallback={<p>{props.fallbackDesc}</p>}>
          {(caste) => (
            <Show when={caste.milkable}>
              <tr>
                <td>{toTitleCase(caste.identifier)}</td>
                <td>
                  Produces {caste.milkable.material} every {caste.milkable.frequency} ticks
                </td>
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default CreatureMilkTable;
