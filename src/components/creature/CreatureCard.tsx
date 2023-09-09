import { Component, Show } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { Creature } from '../../definitions/types';
import RawJsonTable from '../raws/RawsDetailTable';
import CreatureDescriptionTable from './CreateDescriptionTable';
import CreatureBadges from './CreatureBadges';

/**
 * Given a Creature, returns a listing entry for it.
 *
 * The CreatureListing is an accordion with a tabbed interior. The tabs are:
 *
 * - Description:
 *      Gives a description of the creature, followed by its known names and other details.
 *
 * - Raw Details:
 *      Some details on the raw file it was extracted from. This includes
 *
 * @param props - Contains the creature to render details for.
 * @returns Component of creature data for a listing.
 */
const CreatureCard: Component<{ creature: Creature }> = (props) => {
  const title = props.creature.namesMap['SPECIES'][0]
    .split(' ')
    .map((v: string) => toTitleCase(v))
    .join(' ');

  return (
    <>
      <div class='card-body'>
        <div class='card-title'>{title}</div>
        <div class='text-muted italic text-xs'>{props.creature.moduleDisplayName}</div>
        <div class='card-badges'>
          <CreatureBadges creature={props.creature} />
        </div>
        <div>
          <Show
            when={Object.values(props.creature.descriptions).length > 0}
            fallback={<p class='text-muted fst-italic'>No description available.</p>}>
            {Object.values(props.creature.descriptions).join(' ')}
          </Show>
        </div>
      </div>
      <div class='card-actions'>
        <button
          class='btn btn-primary btn-sm'
          onClick={() => {
            const dialog = document.getElementById(`${props.creature.objectId}-details`) as HTMLDialogElement;
            dialog?.showModal();
          }}>
          Show All Details
        </button>
        <button
          onClick={() => {
            const dialog = document.getElementById(`${props.creature.objectId}-raws`) as HTMLDialogElement;
            dialog?.showModal();
          }}
          class='btn btn-sm btn-ghost'>
          See Raw Info
        </button>
      </div>

      {/* Include modal for "Show All Details" */}
      <dialog class='modal' id={`${props.creature.objectId}-details`}>
        <div class='modal-box w-11/12 max-w-5xl'>
          <h3 class='font-bold text-lg'>{title} Details</h3>
          <CreatureDescriptionTable creature={props.creature} />
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>

      {/* Include modal for "See Raw Info" */}
      <dialog class='modal' id={`${props.creature.objectId}-raws`}>
        <div class='modal-box w-11/12 max-w-5xl'>
          <h3 class='font-bold text-lg'>{title} Details</h3>
          <RawJsonTable item={props.creature} />
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CreatureCard;
