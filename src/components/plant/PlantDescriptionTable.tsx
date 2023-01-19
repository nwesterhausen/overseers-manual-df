import { Table } from 'solid-bootstrap';
import { Component, For, Show } from 'solid-js';
import { UndergroundDepthDescription } from '../../definitions/Creature';
import { TickToCalendarConversion } from '../../definitions/Utils';
import { DFPlant } from '../../definitions/types';

const PlantDescriptionTable: Component<{ plant: DFPlant }> = (props) => {
  return (
    <Table>
      <tbody>
        <tr>
          <th>Likeable Features</th>
          <td>{props.plant.preferenceStrings.length > 0 ? props.plant.preferenceStrings.join(', ') : 'None'}</td>
        </tr>
        <tr>
          <th>Found In</th>
          <td>{props.plant.biomes.length ? props.plant.biomes.join(', ') : 'No natural biomes.'}</td>
        </tr>
        <tr>
          <th>Inhabited Depth</th>
          <td>{UndergroundDepthDescription(props.plant.undergroundDepth)}</td>
        </tr>
        <tr>
          <th>Growth Duration</th>
          <td>
            <Show when={props.plant.growthDuration > 0} fallback='No natural growth'>
              Grows in {TickToCalendarConversion(props.plant.growthDuration)} ({props.plant.growthDuration} ticks)
            </Show>
          </td>
        </tr>
        <tr>
          <th>Growths</th>
          <td>
            <Show when={Object.keys(props.plant.growthNames).length > 0} fallback='None'>
              <ul>
                <For each={Object.keys(props.plant.growthNames)}>
                  {(growth) => <li>{props.plant.growthNames[growth].singular}</li>}
                </For>
              </ul>
            </Show>
          </td>
        </tr>
        <tr>
          <th>Base Value</th>
          <td>{props.plant.value}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default PlantDescriptionTable;
