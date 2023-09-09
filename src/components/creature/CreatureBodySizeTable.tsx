import { Component, For } from 'solid-js';
import { BodySizeStatus } from '../../definitions/Creature';
import type { BodySizeRange, CasteRange } from '../../definitions/types';

const CreatureBodySizeTable: Component<{ bodySize: CasteRange<BodySizeRange[]> }> = (props) => {
  const castes = Object.keys(props.bodySize);
  return (
    <table class='table table-xs'>
      <tbody>
        <For each={castes} fallback={<p>No body size data.</p>}>
          {(caste) =>
            props.bodySize[caste].length ? (
              <tr>
                <td>
                  {caste[0]}
                  {caste.slice(1).toLowerCase()}
                </td>
                <td>
                  <div class='join join-vertical gap-0'>
                    <For each={props.bodySize[caste]}>{(size) => <span>{BodySizeStatus(size)}</span>}</For>
                  </div>
                </td>
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

export default CreatureBodySizeTable;
