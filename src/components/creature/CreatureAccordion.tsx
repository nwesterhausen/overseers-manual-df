import { Accordion, Button, Card, Modal } from 'solid-bootstrap';
import { Component, Show, createSignal } from 'solid-js';
import { toTitleCase } from '../../definitions/Utils';
import type { Creature } from '../../definitions/types';
import SpriteImage from '../SpriteImage';
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
const CreatureAccordion: Component<{ creature: Creature }> = (props) => {
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
      <Accordion.Header>
        <SpriteImage identifier={props.creature.identifier} />
        <div class='container-fluid'>
          <div>
            <div>
              <div class='accordion-title'>{title}</div>
            </div>
            <div class='accordion-description'>
              <Show
                when={Object.values(props.creature.descriptions).length > 0}
                fallback={<>No description available</>}>
                {Object.values(props.creature.descriptions).join(' ')}
              </Show>
            </div>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <Card.Text>
          <div class='hstack gap-2'>
            <div>{props.creature.moduleDisplayName}</div>
            <CreatureBadges creature={props.creature} />
          </div>
          <Show
            when={Object.values(props.creature.descriptions).length > 0}
            fallback={<p class='text-muted fst-italic'>No description available.</p>}>
            {Object.values(props.creature.descriptions).join(' ')}
          </Show>
        </Card.Text>
        <div class='card-badges'></div>
        <div class='row'>
          <div class='col-auto'>
            <Button variant='primary' size='sm' onClick={handleOpenDescription}>
              Show All Details
            </Button>
          </div>
          <div class='col-auto ms-auto'>
            <a
              onClick={handleOpenRawDetails}
              class='text-center text-decoration-none fw-light text-muted indicate-clickable'>
              See Raw Info
            </a>
          </div>
        </div>
      </Accordion.Body>

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

export default CreatureAccordion;
