import { Component, For, Show } from 'solid-js';
import { FormatName } from '../../definitions/Creature';
import { DFCaste } from '../../definitions/DFCaste';
import { toTitleCase } from '../../definitions/Utils';

const CreatureNamesTable: Component<{ castes: DFCaste[] }> = (props) => {
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={props.castes} fallback={<p>No name data.</p>}>
          {(caste) => (
            <Show when={caste.casteName}>
              <tr>
                <td>{toTitleCase(caste.identifier)}</td>
                <td>{FormatName(caste.casteName)}</td>
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default CreatureNamesTable;
