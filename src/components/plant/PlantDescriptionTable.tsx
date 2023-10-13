import { Component } from 'solid-js';
import { UndergroundDepthDescription } from '../../definitions/CreatureUtil';
import { Plant } from '../../definitions/Plant';

const PlantDescriptionTable: Component<{ plant: Plant }> = (props) => {
  return (
    <table class='table table-sm'>
      <tbody>
        <tr>
          <th>Likeable Features</th>
          <td>{props.plant.prefStrings ? props.plant.prefStrings.join(', ') : 'None'}</td>
        </tr>
        <tr>
          <th>Found In</th>
          <td>{props.plant.biomes ? props.plant.biomes.join(', ') : 'No natural biomes.'}</td>
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
