import { Button, Card, Modal, Stack } from 'solid-bootstrap';
import { Component, For, createSignal } from 'solid-js';
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

  const [showDescription, setShowDescription] = createSignal(false);
  const handleOpenDescription = () => setShowDescription(true);
  const handleCloseDescription = () => setShowDescription(false);

  const [showRawDetails, setShowRawDetails] = createSignal(false);
  const handleOpenRawDetails = () => setShowRawDetails(true);
  const handleCloseRawDetails = () => setShowRawDetails(false);

  return (
    <>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
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
      </Card.Body>
      <Card.Footer>
        <Stack gap={2}>
          <Button variant='primary' size='sm' onClick={handleOpenDescription}>
            Show All Details
          </Button>
          <a
            onClick={handleOpenRawDetails}
            class='text-center text-decoration-none fw-light text-muted indicate-clickable'>
            See Raw Info
          </a>
        </Stack>
      </Card.Footer>

      {/* Include modal for "Show All Details" */}
      <Modal
        dialogClass='modal90w'
        id={`${props.inorganic.objectId}-details`}
        show={showDescription()}
        onHide={handleCloseDescription}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InorganicDescriptionTable inorganic={props.inorganic} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseDescription}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Include modal for "See Raw Info" */}
      <Modal
        dialogClass='modal90w'
        id={`${props.inorganic.objectId}-raws`}
        show={showRawDetails()}
        onHide={handleCloseRawDetails}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Raws</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RawJsonTable item={props.inorganic} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseRawDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InorganicCard;
