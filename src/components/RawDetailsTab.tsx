import { Tab, Table } from 'solid-bootstrap';
import { Component } from 'solid-js';
import type { Raw } from '../definitions/types';

const RawDetailsTab: Component<{ item: Raw }> = (props) => {
  return (
    <Tab eventKey={`${props.item.objectId}-raws`} title='Raw Details'>
      <Table size='sm'>
        <tbody>
          <tr>
            <th>Identifier</th>
            <td>{props.item.identifier}</td>
          </tr>
          <tr>
            <th>Rawfile</th>
            <td>{props.item.parent_raw}</td>
          </tr>
          <tr>
            <th>ObjectID</th>
            <td>{props.item.objectId}</td>
          </tr>
        </tbody>
      </Table>
    </Tab>
  );
};

export default RawDetailsTab;
