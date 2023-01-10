import { Component } from 'solid-js';
import { SimpleMaterial } from '../../definitions/types';
import StateNameTable from './StateNameTable';

const AllNamesTable: Component<{ mat: SimpleMaterial }> = (props) => {
  return (
    <table class='table table-striped'>
      <tbody>
        <tr>
          <th>Names</th>
          <td>
            <StateNameTable stateName={props.mat.names} />
          </td>
        </tr>
        <tr>
          <th>Adjectives</th>
          <td>
            <StateNameTable stateName={props.mat.adjectives} />
          </td>
        </tr>
        <tr>
          <th>Colors</th>
          <td>
            <StateNameTable stateName={props.mat.colors} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default AllNamesTable;
