import { Button, Card, Modal, Stack } from 'solid-bootstrap';
import { Component, createSignal } from 'solid-js';
import type { Plant } from '../definitions/types';
import RawJsonTable from './RawsDetailTable';
import PlantDescriptionTable from './plant/PlantDescriptionTable';
import PlantProvidesList from './plant/PlantProvidesList';

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
  const listingId = props.plant.objectId + 'listing';
  const title = props.plant.name;

  const [showDescription, setShowDescription] = createSignal(false);
  const handleOpenDescription = () => setShowDescription(true);
  const handleCloseDescription = () => setShowDescription(false);

  const [showRawDetails, setShowRawDetails] = createSignal(false);
  const handleOpenRawDetails = () => setShowRawDetails(true);
  const handleCloseRawDetails = () => setShowRawDetails(false);

  return (
    <Card style={{ width: '20rem', 'min-height': '20rem' }} id={listingId}>
      <Card.Body>
        <Card.Title class='fw-bolder'>{title}</Card.Title>
        <Card.Subtitle class='mb-2 text-muted'>{props.plant.raw_module_display}</Card.Subtitle>
        <Card.Text>
          <PlantProvidesList plant={props.plant} />
        </Card.Text>
      </Card.Body>
      <Card.Footer class='mt-auto'>
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
      <Modal
        dialogClass='modal90w'
        id={`${listingId}-details`}
        show={showDescription()}
        onHide={handleCloseDescription}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body><PlantDescriptionTable plant={props.plant} /></Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseDescription}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal dialogClass='modal90w' id={`${listingId}-raws`} show={showRawDetails()} onHide={handleCloseRawDetails}>
        <Modal.Header closeButton>
          <Modal.Title>{title} Raws</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RawJsonTable item={props.plant} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseRawDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BotanicalCard;
