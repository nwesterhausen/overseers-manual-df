import { Button, Card, Modal, Stack } from 'solid-bootstrap';
import { Component, Show, createSignal } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { Creature } from '../../definitions/types';
import RawJsonTable from '../RawsDetailTable';
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
        <Card.Subtitle>{props.creature.moduleDisplayName}</Card.Subtitle>
        <Card.Text>
          <Show
            when={Object.values(props.creature.descriptions).length > 0}
            fallback={<p class='text-muted fst-italic'>No description available.</p>}>
            {Object.values(props.creature.descriptions).join(' ')}
          </Show>
        </Card.Text>
      </Card.Body>
      <div class='card-badges'>
        <CreatureBadges creature={props.creature} />
      </div>
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
        id={`${props.creature.objectId}-details`}
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

      {/* Include modal for "See Raw Info" */}
      <Modal
        dialogClass='modal90w'
        id={`${props.creature.objectId}-raws`}
        show={showRawDetails()}
        onHide={handleCloseRawDetails}>
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
    </>
  );
};

export default CreatureCard;
