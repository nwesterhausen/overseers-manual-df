import { Component } from 'solid-js';
import { Plant } from '../../definitions/Plant';

const PlantProvidesList: Component<{ plant: Plant }> = (props) => {
  // const materials = createMemo(() => GetAllMaterialDescriptions(props.plant));
  return (
    <>
      Provides:
      <ul>{props.plant.biomes}</ul>
    </>
  );
};

export default PlantProvidesList;
