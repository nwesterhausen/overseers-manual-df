import { Accordion, Tabs, Tab, Table } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { Creature } from '../definitions/Creature';
import { EggLayingStatus, LifeExpectancyStatus } from '../definitions/Creature';
import RawDetailsTab from './RawDetailsTab';
import RawJsonTab from './RawJsonTab';

/**
 * Given a Creature, returns a listing entry for it.
 *
 * The CreatureListing is an accordian with a tabbed interior. The tabs are:
 *
 * - Description:
 *      Gives a description of the creature, followed by its known names and other details.
 *
 * - Raw Details:
 *      Some details on the raw file it was extracted from. This includes
 *
 * @param props - Contains the creature to render details for.
 * @returns Component of creature data for a listing.
 */
const CreatureListing: Component<{ item: Creature }> = (props) => {
  return (
    <Accordion.Item eventKey={props.item.objectId + 'accordian'}>
      <Accordion.Header class='overflow-hidden text-nowrap'>
        {props.item.names[0]} ({props.item.names.slice(1).join(', ')})
      </Accordion.Header>
      <Accordion.Body class='p-0 pt-1'>
        <Tabs defaultActiveKey={`${props.item.objectId}-data`} class='mb-2'>
          <Tab eventKey={`${props.item.objectId}-data`} title='Description'>
            <p>{props.item.description}</p>
            <Table size='sm'>
              <tbody>
                <tr>
                  <th>Known names:</th>
                  <td>{props.item.names.join(', ')}</td>
                </tr>
                <tr>
                  <th>Life Expectancy</th>
                  <td>{LifeExpectancyStatus(props.item)}</td>
                </tr>
                <tr>
                  <th>Egg Laying</th>
                  <td>{EggLayingStatus(props.item)}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>
          <RawDetailsTab item={props.item} />
          <RawJsonTab item={props.item} />
        </Tabs>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default CreatureListing;
