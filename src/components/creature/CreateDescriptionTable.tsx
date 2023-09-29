import { Component, For, Show } from 'solid-js';
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

const CreatureDescriptionTable: Component<{ creature: DFCreature }> = (props) => {
  return (
    <table class='table table-sm'>
      <tbody>
        <tr>
          <th>Names</th>
          <td>
            <CreatureNamesTable castes={props.creature.castes} />
          </td>
        </tr>
        <tr>
          <th>Likeable Features</th>
          <td>
            <Show
              when={Array.isArray(props.creature.prefStrings) && props.creature.prefStrings.length > 0}
              fallback='None'>
              {props.creature.prefStrings.join(', ')}
            </Show>
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
          <td>{props.creature.biomes ? props.creature.biomes.join(', ') : 'No natural biomes.'}</td>
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
            <Show when={Array.isArray(props.creature.tags) && props.creature.tags.length > 0} fallback='None'>
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
                        <td>{caste.tags ? caste.tags.join(', ') : 'None'}</td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </td>
        </tr>
        <tr>
          <th>Pet Value</th>
          <td>{PetValueStatus(props.creature)}</td>
        </tr>
        <tr>
          <th>Grazer</th>
          <td>
            <CreatureGrazerTable castes={props.creature.castes} fallbackDesc='Does not graze' />
          </td>
        </tr>
        <tr>
          <th>Milk Production</th>
          <td>
            <CreatureMilkTable values={props.creature.castes} fallbackDesc='None' />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CreatureDescriptionTable;
