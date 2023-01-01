import { Table } from "solid-bootstrap";
import { Component, For, Show } from "solid-js";
import { UndergroundDepthDescription } from "../../definitions/Creature";
import { TickToCalendarConversion } from "../../definitions/Utils";
import { Plant } from "../../definitions/types";

const PlantDescriptionTable: Component<{ plant: Plant }> = (props) => {
  return (
    <Table>
      <tbody>
        <tr>
          <th>Likeable Features</th>
          <td>{props.plant.pref_string.length > 0 ? props.plant.pref_string.join(', ') : 'None'}</td>
        </tr>
        <tr>
          <th>Found In</th>
          <td>{props.plant.biomes.length ? props.plant.biomes.join(', ') : 'No natural biomes.'}</td>
        </tr>
        <tr>
          <th>Inhabited Depth</th>
          <td>{UndergroundDepthDescription(props.plant.underground_depth)}</td>
        </tr>
        <tr>
          <th>Growth Duration</th>
          <td>
            <Show when={props.plant.growth_duration > 0} fallback="No natural growth">
              Grows in {TickToCalendarConversion(props.plant.growth_duration)} ({props.plant.growth_duration} ticks)
            </Show>
          </td>
        </tr>
        <tr>
          <th>Growths</th>
          <td>
            <Show when={Object.keys(props.plant.growth_names).length > 0} fallback="None">
              <ul>
                <For each={Object.keys(props.plant.growth_names)}>
                  {(growth) => <li>{props.plant.growth_names[growth].singular}</li>}
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