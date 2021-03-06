import { Accordion, Tabs, Tab, Table, Stack } from 'solid-bootstrap';
import { Component } from 'solid-js';
import {
  ClusterSizeStatus,
  CondesedEggSize,
  Creature,
  GrownAtStatus,
  PetValueStatus,
  TrainableStatus,
} from '../definitions/Creature';
import { EggLayingStatus, LifeExpectancyStatus } from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';
import CreatureActivityDisplay from './CreatureActivityDisplay';
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
const CreatureListing: Component<{ creature: Creature }> = (props) => {
  const listingId = props.creature.objectId + 'accordian';

  return (
    <Accordion.Item id={listingId} eventKey={listingId}>
      <Accordion.Header class='overflow-hidden text-nowrap'>
        {props.creature.names_map.SPECIES[0]
          .split(' ')
          .map((v) => toTitleCase(v))
          .join(' ')}
        <Stack class='d-flex justify-content-end w-100 me-3' direction='horizontal' gap={1}>
          {props.creature.lays_eggs ? (
            <TwoPartBadge bg='primary' name='Egg Size' value={'' + CondesedEggSize(props.creature.egg_sizes)} />
          ) : (
            <></>
          )}
          {props.creature.flier.EVERY ? <TwoPartBadge bg='primary' name='Flier' value={''} /> : <></>}
          {props.creature.intelligence.EVERY &&
          props.creature.intelligence.EVERY[0] &&
          props.creature.intelligence.EVERY[1] ? (
            <TwoPartBadge bg='primary' name='Intelligent' value={''} />
          ) : (
            <>
              {props.creature.intelligence.EVERY && props.creature.intelligence.EVERY[0] ? (
                <TwoPartBadge bg='primary' name='Learns' value={''} />
              ) : (
                <></>
              )}
              {props.creature.intelligence.EVERY && props.creature.intelligence.EVERY[1] ? (
                <TwoPartBadge bg='primary' name='Speaks' value={''} />
              ) : (
                <></>
              )}
            </>
          )}
          {props.creature.gnawer.EVERY ? <TwoPartBadge bg='primary' name='Gnawer' value={''} /> : <></>}
          {props.creature.pet_value.EVERY > 0 ? (
            <TwoPartBadge bg='primary' name='Pet Value' value={`${props.creature.pet_value.EVERY}`} />
          ) : (
            <></>
          )}
          {props.creature.local_pops_controllable ? <TwoPartBadge bg='primary' name='Playable' value={''} /> : <></>}
          {props.creature.local_pops_produce_heroes ? <TwoPartBadge bg='primary' name='Civilized' value={''} /> : <></>}
        </Stack>
      </Accordion.Header>
      <Accordion.Body class='p-0 pt-1'>
        <Tabs defaultActiveKey={`${props.creature.objectId}-data`} class='mb-2'>
          <Tab eventKey={`${props.creature.objectId}-data`} title='Description'>
            <p class='px-3 pt-3'>{props.creature.description}</p>
            <Table>
              <tbody>
                <tr>
                  <th>Names</th>
                  <td>
                    <CreatureNamesTable names={props.creature.names_map} />
                  </td>
                </tr>
                <tr>
                  <th>Life Expectancy</th>
                  <td>{LifeExpectancyStatus(props.creature)}</td>
                </tr>
                <tr>
                  <th>Egg Laying</th>
                  <td>{EggLayingStatus(props.creature)}</td>
                </tr>
                <tr>
                  <th>Found In</th>
                  <td>{props.creature.biomes.length ? props.creature.biomes.join(', ') : 'No natural biomes.'}</td>
                </tr>
                <tr>
                  <th>Group Size</th>
                  <td>{ClusterSizeStatus(props.creature)}</td>
                </tr>
                <tr>
                  <th>Growth Patterns</th>
                  <td>
                    <CreatureBodySizeTable bodysize={props.creature.body_size} />
                    <span>{GrownAtStatus(props.creature.grown_at)}</span>
                  </td>
                </tr>
                <tr>
                  <th>Activity</th>
                  <td>
                    <CreatureActivityDisplay creature={props.creature} />
                  </td>
                </tr>
                <tr>
                  <th>Trainable</th>
                  <td>{TrainableStatus(props.creature.trainable.EVERY)}</td>
                </tr>
                <tr>
                  <th>Defining Classes</th>
                  <td>
                    {props.creature.creature_class.EVERY
                      ? props.creature.creature_class.EVERY.map((v) => toTitleCase(v.replaceAll('_', ' '))).join(', ')
                      : 'None'}
                  </td>
                </tr>
                <tr>
                  <th>Pet Value</th>
                  <td>{PetValueStatus(props.creature)}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>
          <RawDetailsTab item={props.creature} />
          <RawJsonTab item={props.creature} />
        </Tabs>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default CreatureListing;
