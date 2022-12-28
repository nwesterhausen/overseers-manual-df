import { Table } from 'solid-bootstrap';
import { Component } from 'solid-js';
import {
  ClusterSizeStatus,
  EggLayingStatus,
  GrownAtStatus,
  LifeExpectancyStatus,
  PetValueStatus,
  PopulationNumberStatus,
  TrainableStatus,
  UndergroundDepthDescription,
} from '../definitions/Creature';
import { toTitleCase } from '../definitions/Utils';
import { Creature } from '../definitions/types';
import CreatureActivityDisplay from './CreatureActivityDisplay';
import CreatureBodySizeTable from './CreatureBodySizeTable';
import CreatureGrazerTable from './CreatureGrazerTable';
import CreatureListTable from './CreatureListTable';
import CreatureMilkTable from './CreatureMilkTable';
import CreatureNamesTable from './CreatureNamesTable';
import CreatureNumberTable from './CreatureNumberTable';

const CreatureDescriptionTable: Component<{ creature: Creature }> = (props) => {
  return (
    <Table>
      <tbody>
        <tr>
          <th>Names</th>
          <td>
            <CreatureNamesTable names={props.creature.names_map} />
          </td>
        </tr>
        <tr>
          <th>Likeable Features</th>
          <td>{props.creature.pref_string.length > 0 ? props.creature.pref_string.join(', ') : 'None'}</td>
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
          <th>Inhabited Depth</th>
          <td>{UndergroundDepthDescription(props.creature.underground_depth)}</td>
        </tr>
        <tr>
          <th>Group Size</th>
          <td>
            {ClusterSizeStatus(props.creature)} {PopulationNumberStatus(props.creature)}
          </td>
        </tr>
        <tr>
          <th>Growth Patterns</th>
          <td>
            <CreatureBodySizeTable bodySize={props.creature.body_size} />
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
          <td>{TrainableStatus(props.creature.trainable.ALL)}</td>
        </tr>
        <tr>
          <th>Defining Classes</th>
          <td>
            {props.creature.creature_class.ALL
              ? props.creature.creature_class.ALL.map((v) => toTitleCase(v.replaceAll('_', ' '))).join(', ')
              : 'None'}
          </td>
        </tr>
        <tr>
          <th>Tags</th>
          <td>
            <CreatureListTable
              values={Object.assign(props.creature.caste_tags, { SPECIES: props.creature.tags })}
              fallbackDesc=''
            />
          </td>
        </tr>
        <tr>
          <th>Pet Value</th>
          <td>{PetValueStatus(props.creature)}</td>
        </tr>
        <tr>
          <th>Difficulty</th>
          <td>
            <CreatureNumberTable values={props.creature.difficulty} fallbackDesc='Mundane/no difficulty' />
          </td>
        </tr>
        <tr>
          <th>Lowlight Vision</th>
          <td>
            <CreatureNumberTable values={props.creature.low_light_vision} fallbackDesc='No low light visibility' />
          </td>
        </tr>
        <tr>
          <th>Grass Trampling</th>
          <td>
            <CreatureNumberTable values={props.creature.grass_trample} fallbackDesc='Does not trample grass' />
          </td>
        </tr>
        <tr>
          <th>Grazer</th>
          <td>
            <CreatureGrazerTable values={props.creature.grazer} fallbackDesc='Does not graze' />
          </td>
        </tr>
        <tr>
          <th>Population Ratio</th>
          <td>
            <CreatureNumberTable values={props.creature.pop_ratio} fallbackDesc='No data available' />
          </td>
        </tr>
        <tr>
          <th>Milk Production</th>
          <td>
            <CreatureMilkTable values={props.creature.milkable} fallbackDesc='None' />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CreatureDescriptionTable;