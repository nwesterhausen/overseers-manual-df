import { Tab } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { Raw } from '../definitions/Raw';

const RawJsonTab: Component<{ item: Raw }> = (props) => {
  return (
    <Tab eventKey={`${props.item.objectId}-rawjson`} title='Parsed Raw JSON'>
      <pre class='p-1 text-muted'>{JSON.stringify(props.item, null, 2)}</pre>
    </Tab>
  );
};

export default RawJsonTab;
