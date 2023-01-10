import { Table } from 'solid-bootstrap';
import { Component, Show } from 'solid-js';
import { SimpleMaterial } from '../../definitions/types';

const TemperatureTable: Component<{ mat: SimpleMaterial }> = (props) => {
  return (
    <Table>
      <Show when={props.mat.temperatures.ignitionPoint > 0}>
        <tr>
          <th>Ignition Point</th>
          <td>{props.mat.temperatures.ignitionPoint}°U</td>
        </tr>
      </Show>
      <Show when={props.mat.temperatures.meltingPoint > 0}>
        <tr>
          <th>Melting Point</th>
          <td>{props.mat.temperatures.meltingPoint}°U</td>
        </tr>
      </Show>
      <Show when={props.mat.temperatures.boilingPoint > 0}>
        <tr>
          <th>Boiling Point</th>
          <td>{props.mat.temperatures.boilingPoint}°U</td>
        </tr>
      </Show>
      <Show when={props.mat.temperatures.coldDamagePoint > 0}>
        <tr>
          <th>Cold Damage Point</th>
          <td>{props.mat.temperatures.coldDamagePoint}°U</td>
        </tr>
      </Show>
      <Show when={props.mat.temperatures.heatDamagePoint > 0}>
        <tr>
          <th>Heat Damage Point</th>
          <td>{props.mat.temperatures.heatDamagePoint}°U</td>
        </tr>
      </Show>
    </Table>
  );
};

export default TemperatureTable;
