import { Stack, Table } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { BodySizeStatus } from '../definitions/Creature';
import type { CasteRange, BodySizeRange } from '../definitions/types';

const CreatureBodySizeTable: Component<{ bodysize: CasteRange<BodySizeRange[]> }> = (props) => {
  const castes = Object.keys(props.bodysize);
  return (
    <Table size='sm' borderless>
      <tbody>
        <For each={castes} fallback={<p>No body size data.</p>}>
          {(caste) =>
            props.bodysize[caste].length ? (
              <tr>
                <td>
                  {caste[0]}
                  {caste.slice(1).toLowerCase()}
                </td>
                <td>
                  <Stack gap={1}>
                    <For each={props.bodysize[caste]}>{(size) => <span>{BodySizeStatus(size)}</span>}</For>
                  </Stack>
                </td>
              </tr>
            ) : (
              ''
            )
          }
        </For>
      </tbody>
    </Table>
  );
};

export default CreatureBodySizeTable;
