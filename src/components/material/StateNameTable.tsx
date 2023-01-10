import { Component, Show } from 'solid-js';
import { StateName } from '../../definitions/types';

const StateNameTable: Component<{ stateName: StateName }> = (props) => {
  return (
    <ul>
      <li>Solid: {props.stateName.solid}</li>
      <Show when={props.stateName.liquid !== 'magma'}>
        <li>Liquid: {props.stateName.liquid}</li>
        <li>Gas: {props.stateName.gas}</li>
      </Show>{' '}
    </ul>
  );
};
export default StateNameTable;
