import { Accordion, Tabs, Tab, Table, Stack } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { ClusterSizeStatus, CondesedEggSize, Creature, GrownAtStatus } from '../definitions/Creature';
import { EggLayingStatus, LifeExpectancyStatus } from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';
import CreatureBodySizeTable from './CreatureBodySizeTable';
import CreatureNamesTable from './CreatureNamesTable';
import RawDetailsTab from './RawDetailsTab';
import RawJsonTab from './RawJsonTab';
import TwoPartBadge from './TwoPartBadge';

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
        {props.item.names_map.SPECIES[0]
          .split(' ')
          .map((v) => toTitleCase(v))
          .join(' ')}
        <Stack class='d-flex justify-content-end w-100 me-3' direction='horizontal' gap={1}>
          {props.item.lays_eggs ? (
            <TwoPartBadge bg='success' name='Egg-layer' value={'' + CondesedEggSize(props.item.egg_sizes)} />
          ) : (
            <></>
          )}
        </Stack>
      </Accordion.Header>
      <Accordion.Body class='p-0 pt-1'>
        <Tabs defaultActiveKey={`${props.item.objectId}-data`} class='mb-2'>
          <Tab eventKey={`${props.item.objectId}-data`} title='Description'>
            <p class='px-3 pt-3'>{props.item.description}</p>
            <Table>
              <tbody>
                <tr>
                  <th>Names</th>
                  <td>
                    <CreatureNamesTable names={props.item.names_map} />
                  </td>
                </tr>
                <tr>
                  <th>Life Expectancy</th>
                  <td>{LifeExpectancyStatus(props.item)}</td>
                </tr>
                <tr>
                  <th>Egg Laying</th>
                  <td>{EggLayingStatus(props.item)}</td>
                </tr>
                <tr>
                  <th>Found In</th>
                  <td>{props.item.biomes.length ? props.item.biomes.join(', ') : 'No natural biomes.'}</td>
                </tr>
                <tr>
                  <th>Group Size</th>
                  <td>{ClusterSizeStatus(props.item)}</td>
                </tr>
                <tr>
                  <th>Growth Patterns</th>
                  <td>
                    <CreatureBodySizeTable bodysize={props.item.body_size} />
                    <span>{GrownAtStatus(props.item.grown_at)}</span>
                  </td>
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
