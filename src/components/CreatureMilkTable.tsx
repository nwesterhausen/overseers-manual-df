import { Table } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { CasteRange, MilkableDesc } from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';

const CreatureMilkTable: Component<{ values: CasteRange<MilkableDesc>; fallbackDesc: string }> = (props) => {
  const values = props.values;
  return (
    <Table class='m-0 p-0' size='sm' borderless>
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
    </Table>
  );
};

export default CreatureMilkTable;
