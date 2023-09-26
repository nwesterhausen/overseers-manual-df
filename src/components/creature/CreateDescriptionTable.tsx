import { Component, For } from 'solid-js';
import {
  ClusterSizeStatus,
  EggLayingStatus,
  GrownAtStatus,
  LifeExpectancyStatus,
  PetValueStatus,
  PopulationNumberStatus,
  TrainableStatus,
  UndergroundDepthDescription,
} from '../../definitions/Creature';
import { DFCreature } from '../../definitions/DFCreature';
import { toTitleCase } from '../../definitions/Utils';
import CreatureActivityDisplay from './CreatureActivityDisplay';
import CreatureBodySizeTable from './CreatureBodySizeTable';
import CreatureGrazerTable from './CreatureGrazerTable';
import CreatureMilkTable from './CreatureMilkTable';
import CreatureNamesTable from './CreatureNamesTable';
import CreatureNumberTable from './CreatureNumberTable';

const CreatureDescriptionTable: Component<{ creature: DFCreature }> = (props) => {
  return (
    <table class='table table-sm'>
      <tbody>
        <tr>
          <th>Names</th>
          <td>
            <CreatureNamesTable names={props.creature} />
          </td>
        </tr>
        <tr>
          <th>Likeable Features</th>
          <td>{props.creature.prefStrings.length > 0 ? props.creature.prefStrings.join(', ') : 'None'}</td>
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
          <td>{UndergroundDepthDescription(props.creature.undergroundDepth)}</td>
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
            <CreatureBodySizeTable castes={props.creature.castes} />
            <span>{GrownAtStatus(props.creature)}</span>
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
          <td>{props.creature.castes.map((v) => TrainableStatus(v)).join(', ')}</td>
        </tr>
        <tr>
          <th>Defining Classes</th>
          <td>{props.creature.castes.map((v) => v.creatureClass).join(', ')}</td>
        </tr>
        <tr>
          <th>Tags</th>
          <td>
            <table class='table table-xs'>
              <tbody>
                <tr>
                  <td>Creature Tags</td>
                  <td>{props.creature.tags.join(', ')}</td>
                </tr>
                <For each={props.creature.castes}>
                  {(caste) => (
                    <tr>
                      <td>{toTitleCase(caste.identifier)}</td>
                      <td>{caste.tags.join(', ')}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <th>Pet Value</th>
          <td>{PetValueStatus(props.creature)}</td>
        </tr>
        <tr>
          <th>Difficulty</th>
          <td>
            <CreatureNumberTable values={props.creature} fallbackDesc='Mundane/no difficulty' />
          </td>
        </tr>
        <tr>
          <th>Lowlight Vision</th>
          <td>
            <CreatureNumberTable values={props.creature} fallbackDesc='No low light visibility' />
          </td>
        </tr>
        <tr>
          <th>Grass Trampling</th>
          <td>
            <CreatureNumberTable values={props.creature} fallbackDesc='Does not trample grass' />
          </td>
        </tr>
        <tr>
          <th>Grazer</th>
          <td>
            <CreatureGrazerTable castes={props.creature.castes} fallbackDesc='Does not graze' />
          </td>
        </tr>
        <tr>
          <th>Population Ratio</th>
          <td>
            <CreatureNumberTable values={props.creature.populationNumber} fallbackDesc='No data available' />
          </td>
        </tr>
        <tr>
          <th>Milk Production</th>
          <td>
            <CreatureMilkTable values={props.creature} fallbackDesc='None' />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CreatureDescriptionTable;
