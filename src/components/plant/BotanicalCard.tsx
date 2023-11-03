import { Component, For, Show } from 'solid-js';
import { Plant } from '../../definitions/Plant';
import { GetPlantProvidesList } from '../../lib/PlantUtil';
import { UndergroundDepthDescription, toTitleCase } from '../../lib/Utils';

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
        <Show when={props.plant.prefStrings && props.plant.prefStrings.length > 0}>
          <div class='font-medium'>Liked for its {props.plant.prefStrings.join(', ')}.</div>
        </Show>
        <div class='mb-2'>Found {UndergroundDepthDescription(props.plant.undergroundDepth)}</div>
        <Show when={GetPlantProvidesList(props.plant).length > 0}>
          <div class='font-medium'>Provides:</div>
          <ul class='list-disc list-inside'>
            <For each={GetPlantProvidesList(props.plant)}>{(provision) => <li>{toTitleCase(provision)}</li>}</For>
          </ul>
        </Show>
      </div>
    </>
  );
};

export default BotanicalCard;
