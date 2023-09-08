import { Card, Modal } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { DFInorganic } from '../../definitions/types';
import RawJsonTable from '../raws/RawsDetailTable';
import InorganicDescriptionTable from './InorganicDescriptionTable';

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
const InorganicCard: Component<{ inorganic: DFInorganic }> = (props) => {
  const title = toTitleCase(props.inorganic.name);

  return (
    <>
      <div class='card-body'>
        <div class='card-title'>{title}</div>
        <Card.Subtitle>{props.inorganic.moduleDisplayName}</Card.Subtitle>
        <Card.Text>
          Some simple details:
          <ul>
            <li>Color: {props.inorganic.material.colors.solid}</li>
            <li>Magma Safe: {props.inorganic.magmaSafe ? 'YES' : 'NO'}</li>
            <li>
              Smelted into:{' '}
              {props.inorganic.metalOres.length === 0 ? (
                <>Nothing</>
              ) : (
                <ul>
                  <For each={props.inorganic.metalOres}>
                    {(smeltingRoll) => (
                      <li>
                        {smeltingRoll.chance}% for {smeltingRoll.result} bar
                      </li>
                    )}
                  </For>
                </ul>
              )}
            </li>
            <li>
              Extracted into:{' '}
              {props.inorganic.threadMetals.length === 0 ? (
                <>Nothing</>
              ) : (
                <ul>
                  <For each={props.inorganic.threadMetals}>
                    {(extractionRoll) => (
                      <li>
                        {extractionRoll.chance}% for {extractionRoll.result} thread
                      </li>
                    )}
                  </For>
                </ul>
              )}
            </li>
          </ul>
        </Card.Text>
      </div>
      <div class='card-actions'>
        <button
          class='btn btn-primary btn-sm'
          onClick={() => {
            const dialog = document.getElementById(`${props.inorganic.objectId}-details`) as HTMLDialogElement;
            dialog?.showModal();
          }}>
          Show All Details
        </button>
        <button
          onClick={() => {
            const dialog = document.getElementById(`${props.inorganic.objectId}-raws`) as HTMLDialogElement;
            dialog?.showModal();
          }}
          class='btn btn-sm btn-ghost'>
          See Raw Info
        </button>
      </div>

      {/* Include modal for "Show All Details" */}
      <dialog class='modal' id={`${props.inorganic.objectId}-details`}>
        <div class='modal-box w-11/12 max-w-5xl'></div>
        <Modal.Header closeButton>
          <Modal.Title>{title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InorganicDescriptionTable inorganic={props.inorganic} />
        </Modal.Body>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>

      {/* Include modal for "See Raw Info" */}
      <dialog class='modal' id={`${props.inorganic.objectId}-raws`}>
        <div class='modal-box w-11/12 max-w-5xl'></div>
        <Modal.Header closeButton>
          <Modal.Title>{title} Raws</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RawJsonTable item={props.inorganic} />
        </Modal.Body>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default InorganicCard;
