import { Component, For, Show } from 'solid-js';
import { Plant } from '../../definitions/Plant';
import { friendlyMaterialName, toTitleCase } from '../../lib/Utils';

const PlantProvidesList: Component<{ plant: Plant }> = (props) => {
  // const materials = createMemo(() => GetAllMaterialDescriptions(props.plant));
  return (
    <>
      Provides:
      <ul>
        <Show when={props.plant.materials}>
          <For each={props.plant.materials}>
            {(material) => (
              <Show when={material.name === 'WOOD'}>
                <li>{friendlyMaterialName(material, props.plant.name.singular)}</li>
              </Show>
            )}
          </For>
        </Show>
        <Show when={props.plant.growths}>
          <For each={props.plant.growths}>
            {(growth) => (
              <Show when={growth.name}>
                <li>{toTitleCase(growth.name.singular)}</li>
              </Show>
            )}
          </For>
        </Show>
      </ul>
    </>
  );
};

export default PlantProvidesList;
