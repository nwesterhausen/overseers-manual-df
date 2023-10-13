import { Component } from 'solid-js';
import { Creature } from '../../definitions/Creature';
import { FormatDescription, FormatName } from '../../definitions/CreatureUtil';
import { Raw } from '../../definitions/types';
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
  const title = FormatName(props.creature.name);
  return (
    <>
      <div class='card-body'>
        <div class='flex flex-row'>
          <div class='flex-grow'>
            <div class='card-title'>{title}</div>
            <div class='text-muted italic text-xs'>
              {props.creature.metadata.moduleName} {props.creature.metadata.moduleVersion}
            </div>
          </div>
          {/* <div class='self-center'>
            <SpriteImage identifier={props.creature.identifier} />
          </div> */}
        </div>
        <div class='card-badges'>
          <CreatureBadges creature={props.creature} />
        </div>
        <div>{FormatDescription(props.creature)}</div>
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
          <RawJsonTable item={props.creature as unknown as Raw} />
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CreatureCard;
