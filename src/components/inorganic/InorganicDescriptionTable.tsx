import { Component } from 'solid-js';
import { DFInorganic } from '../../definitions/types';
import AllNamesTable from '../material/AllNamesTable';
import TemperatureTable from '../material/TemperatureTable';

const InorganicDescriptionTable: Component<{ inorganic: DFInorganic }> = (props) => {
  return (
    <table class='table table-sm'>
      <tbody>
        <tr>
          <th>Base Material Value</th>
          <td>{props.inorganic.material.value}</td>
        </tr>
        <tr>
          <th>State of Matter Description</th>
          <td>
            <AllNamesTable mat={props.inorganic.material} />
          </td>
        </tr>
        <tr>
          <th>Temperature Details</th>
          <td>
            <TemperatureTable mat={props.inorganic.material} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default InorganicDescriptionTable;
