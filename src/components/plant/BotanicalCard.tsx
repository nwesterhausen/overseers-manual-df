import { Card, Modal } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { DFPlant } from '../../definitions/types';
import RawJsonTable from '../raws/RawsDetailTable';
import PlantDescriptionTable from './PlantDescriptionTable';
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
const BotanicalCard: Component<{ plant: DFPlant }> = (props) => {
  const title = toTitleCase(props.plant.name);

  return (
    <>
      <div class='card-body'>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle>{props.plant.moduleDisplayName}</Card.Subtitle>
        <Card.Text>
          <PlantProvidesList plant={props.plant} />
        </Card.Text>
      </div>
      <div class='card-actions'>
        <button
          class='btn btn-primary btn-sm'
          onClick={() => {
            const dialog = document.getElementById(`${props.plant.objectId}-details`) as HTMLDialogElement;
            dialog?.showModal();
          }}>
          Show All Details
        </button>
        <button
          onClick={() => {
            const dialog = document.getElementById(`${props.plant.objectId}-raws`) as HTMLDialogElement;
            dialog?.showModal();
          }}
          class='btn btn-sm btn-ghost'>
          See Raw Info
        </button>
      </div>

      {/* Include modal for "Show All Details" */}
      <dialog class='modal' id={`${props.plant.objectId}-details`}>
        <div class='modal-box w-11/12 max-w-5xl'>
          <Modal.Header closeButton>
            <Modal.Title>{title} Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PlantDescriptionTable plant={props.plant} />
          </Modal.Body>
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>

      {/* Include modal for "See Raw Info" */}
      <dialog class='modal' id={`${props.plant.objectId}-raws`}>
        <div class='modal-box w-11/12 max-w-5xl'>
          <Modal.Header closeButton>
            <Modal.Title>{title} Raws</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RawJsonTable item={props.plant} />
          </Modal.Body>
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default BotanicalCard;
