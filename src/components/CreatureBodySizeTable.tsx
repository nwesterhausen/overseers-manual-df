import { Stack, Table } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { BodySizeRange, BodySizeStatus, CasteRange } from '../definitions/Creature';

const CreatureBodySizeTable: Component<{ bodysize: CasteRange<BodySizeRange[]> }> = (props) => {
  const castes = Object.keys(props.bodysize);
  const totalLength = Object.values(props.bodysize).reduce((a, b) => {
    return a + b.length;
  }, 0);
  if (totalLength === 0) {
    return <></>;
  }
  return (
    <Table size='sm' borderless>
      <tbody>
        <For each={castes} fallback={<p>No body size data.</p>}>
          {(caste) =>
            props.bodysize[caste].length ? (
              <tr>
                {caste === 'ALL' ? (
                  ''
                ) : (
                  <td>
                    {caste[0]}
                    {caste.slice(1).toLowerCase()}
                  </td>
                )}
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
