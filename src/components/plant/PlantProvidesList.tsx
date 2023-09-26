import { Component } from 'solid-js';
import { DFPlant } from '../../definitions/DFPlant';

const PlantProvidesList: Component<{ plant: DFPlant }> = (props) => {
  // const materials = createMemo(() => GetAllMaterialDescriptions(props.plant));
  return (
    <>
      Provides:
      <ul>unknown</ul>
    </>
  );
};

export default PlantProvidesList;
