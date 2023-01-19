import { Component, For, createMemo } from 'solid-js';
import { GetAllMaterialDescriptions } from '../../definitions/Plant';
import { DFPlant } from '../../definitions/types';

const PlantProvidesList: Component<{ plant: DFPlant }> = (props) => {
  const materials = createMemo(() => GetAllMaterialDescriptions(props.plant));
  return (
    <>
      Provides:
      <ul>
        <For each={materials()} fallback={<li>Nothing tangible.</li>}>
          {(description) => <li>{description}</li>}
        </For>
      </ul>
    </>
  );
};

export default PlantProvidesList;
