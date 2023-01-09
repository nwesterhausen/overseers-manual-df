import { Table } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { DFInfoFile } from '../definitions/types';

const RawModuleInfoTable: Component<{ module: DFInfoFile }> = (props) => {
  if (!props.module) {
    return <></>;
  }
  return (
    <Table>
      <tbody>
        <tr>
          <th>Name</th>
          <td>
            {props.module.name} v{props.module.displayedVersion}
          </td>
        </tr>
        <tr>
          <th>Author</th>
          <td>{props.module.author}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{props.module.description}</td>
        </tr>
        <tr>
          <th>Identifier</th>
          <td>{props.module.identifier}</td>
        </tr>
        <tr>
          <th>Found in</th>
          <td>{props.module.sourcedDirectory}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default RawModuleInfoTable;
