import { Component, For } from 'solid-js';
import { CleanName, toTitleCase } from '../../definitions/Utils';
import type { CasteRange } from '../../definitions/types';

const CreatureNamesTable: Component<{ names: CasteRange<string[]> }> = (props) => {
  const names = props.names;
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={Object.keys(names)} fallback={<p>No name data.</p>}>
          {(caste) =>
            names[caste] && names[caste].length && names[caste].join('').length ? (
              <tr>
                <td>
                  {caste
                    .split('_')
                    .map((v) => toTitleCase(v))
                    .join(' ')}
                </td>
                <td>{CleanName(names[caste])}</td>
              </tr>
            ) : (
              ''
            )
          }
        </For>
      </tbody>
    </table>
  );
};

export default CreatureNamesTable;
