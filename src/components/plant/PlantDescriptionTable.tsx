import { invoke } from '@tauri-apps/api/primitives';
import { Component, For, Show, createResource } from 'solid-js';
import { Plant } from '../../definitions/Plant';
import { UndergroundDepthDescription } from '../../lib/CreatureUtil';

const PlantDescriptionTable: Component<{ plant: Plant }> = (props) => {
  const [biomes] = createResource(
    async () => {
      if (!props.plant.biomes) {
        return [];
      }
      const biomes = [];
      for (const biome of props.plant.biomes) {
        biomes.push(await invoke('get_biome_description', { biomeToken: biome }));
      }
      return biomes;
    },
    {
      initialValue: [],
    },
  );
  return (
    <table class='table table-sm'>
      <tbody>
        <tr>
          <th>Likeable Features</th>
          <td>{props.plant.prefStrings ? props.plant.prefStrings.join(', ') : 'None'}</td>
        </tr>
        <tr>
          <th>Found In</th>
          <td>
            <Show when={biomes.latest.length > 0} fallback={<>No known biomes.</>}>
              <ul>
                <For each={biomes.latest}>{(biome) => <li>{biome}</li>}</For>
              </ul>
            </Show>
          </td>
        </tr>
        <tr>
          <th>Inhabited Depth</th>
          <td>{UndergroundDepthDescription(props.plant.undergroundDepth)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PlantDescriptionTable;
