import { Button, Card, Modal, Stack } from 'solid-bootstrap';
import { Component, Show, createSignal } from 'solid-js';
import { toTitleCase } from '../definitions/Utils';
import type { Creature } from '../definitions/types';
import CreatureDescriptionTable from './CreateDescriptionTable';
import CreatureBadges from './CreatureBadges';
import RawJsonTable from './RawsDetailTable';

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
const CreatureListing: Component<{ creature: Creature }> = (props) => {
  const listingId = props.creature.objectId + 'listing';
  const title = props.creature.names_map.SPECIES[0]
    .split(' ')
    .map((v: string) => toTitleCase(v))
    .join(' ');
  const subTitle = props.creature.raw_module + ' v' + props.creature.raw_module_version;

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
        <Card.Subtitle class='mb-2 text-muted'>{subTitle}</Card.Subtitle>
        <Card.Text>
          <Show
            when={Object.values(props.creature.descriptions).length > 0}
            fallback={<p class='text-muted fst-italic'>No description available.</p>}>
            {Object.values(props.creature.descriptions).join(' ')}
          </Show>
        </Card.Text>
      </Card.Body>
      <div class='mb-2'>
        <CreatureBadges creature={props.creature} />
      </div>
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
        <Modal.Body>
          <CreatureDescriptionTable creature={props.creature} />
        </Modal.Body>
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
          <RawJsonTable item={props.creature} />
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

export default CreatureListing;
