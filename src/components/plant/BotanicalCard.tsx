import { Component } from 'solid-js';
import { Plant } from '../../definitions/Plant';
import PlantProvidesList from './PlantProvidesList';

/**
 * Given a Plant, returns a listing entry for it.
 *
 * The BotanicalCard is an card with buttons for showing more data.
 *
 * - Show All Details:
 *      Gives a description of the plant, followed by its known names and other details.
 *
 * - Raw Details:
 *      Some details on the raw file it was extracted from.
 *
 * @param props - Contains the creature to render details for.
 * @returns Component of creature data for a listing.
 */
const BotanicalCard: Component<{ plant: Plant }> = (props) => {
  return (
    <>
      <div>
        <PlantProvidesList plant={props.plant} />
      </div>
    </>
  );
};

export default BotanicalCard;
