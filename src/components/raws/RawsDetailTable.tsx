import { Table } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { Raw } from '../../definitions/types';
import { useRawsProvider } from '../../providers/RawsProvider';

const RawJsonTable: Component<{ item: Raw }> = (props) => {
  const rawsContext = useRawsProvider();
  return (
    <>
      <Table>
        <tbody>
          <tr>
            <th>Identifier</th>
            <td>{props.item.identifier}</td>
          </tr>
          <tr>
            <th>Raw file</th>
            <td>{props.item.parentRaw}</td>
          </tr>
          <tr>
            <th>ObjectID</th>
            <td>{props.item.objectId}</td>
          </tr>
          <tr>
            <th>Raws as JSON</th>
            <td>
              <pre class='p-1 text-muted'>{JSON.stringify(props.item, null, 2)}</pre>
            </td>
          </tr>
          <tr>
            <th>Graphics Raws</th>
            <td>
              <pre class='p-1 text-muted'>
                {JSON.stringify(rawsContext.allGraphicsFor(props.item.identifier), null, 2)}
              </pre>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default RawJsonTable;
