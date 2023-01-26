import { Form, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { Component, createMemo } from 'solid-js';
import { getDescriptionByKey } from '../definitions/Announcements';
import { AnnouncementFlag, DFAnnouncement } from '../definitions/types';

const AnnouncementForm: Component<{
  announcement: DFAnnouncement;
  update: (key: string, flag: AnnouncementFlag, remove?: boolean) => void;
}> = (props) => {
  const description = createMemo(() => getDescriptionByKey(props.announcement.key));

  const handleUpdate = (event: Event) => {
    const el = event.target as HTMLInputElement;
    const flag = el.dataset.flag as AnnouncementFlag;
    console.log('Calling update with', { key: props.announcement.key, flag, remove: !el.checked });
    props.update(props.announcement.key, flag, !el.checked);
  };

  return (
    <Form class='mt-2'>
      <div class='mb-2'>
        <p class='p-0 m-0 fs-5'>
          <strong>{props.announcement.key}</strong>
          {description().longDescription.length > 0 ? <span>{` (${description().longDescription})`}</span> : <></>}
        </p>
        {description().exampleText.length > 0 ? (
          <p class='p-0 fs-5 text-info'>
            <em>{description().exampleText}</em>
          </p>
        ) : (
          <></>
        )}
      </div>
      <Form.Group>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Causes the announcement to be displayed at the bottom of the screen in adventure mode (and be viewable in
              the announcements list).
            </Tooltip>
          }>
          <Form.Check
            data-flag='AdventureDisplay'
            onClick={handleUpdate}
            inline
            checked={props.announcement.flags.indexOf('AdventureDisplay') !== -1}
            label='A_D'
          />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Causes the announcement to appear under one of the categories at the left side of the screen in fortress
              mode.
            </Tooltip>
          }>
          <Form.Check inline checked={props.announcement.flags.indexOf('DwarfDisplay') !== -1} label='D_D' />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Causes the announcement to appear under the alert button at the left side of the screen in fortress mode.
            </Tooltip>
          }>
          <Form.Check inline checked={props.announcement.flags.indexOf('Alert') !== -1} label='ALERT' />
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Pauses the game when the announcement occurs.</Tooltip>}>
          <Form.Check inline checked={props.announcement.flags.indexOf('Pause') !== -1} label='P' />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>Recenter the game to the location of the announcement when the announcement occurs.</Tooltip>
          }>
          <Form.Check inline checked={props.announcement.flags.indexOf('Recenter') !== -1} label='R' />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Causes a box to appear in the middle of the screen, requiring a click on the Okay button to close it. If
              multiple boxes are displayed at the same time, the button says More and displays the next box.
            </Tooltip>
          }>
          <Form.Check inline checked={props.announcement.flags.indexOf('DoMega') !== -1} label='DO_MEGA' />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Causes the announcement to appear in all reports. A new report will be created if none are active.
            </Tooltip>
          }>
          <Form.Check inline checked={props.announcement.flags.indexOf('UnitCombatReport') !== -1} label='UCR' />
        </OverlayTrigger>
        <OverlayTrigger
          overlay={
            <Tooltip>
              Nearly identical to UNIT_COMBAT_REPORT (UCR), but does not create a new report if none are active.
            </Tooltip>
          }>
          <Form.Check
            inline
            checked={props.announcement.flags.indexOf('UnitCombatReportAllActive') !== -1}
            label='UCR_A'
          />
        </OverlayTrigger>
      </Form.Group>
    </Form>
  );
};

export default AnnouncementForm;
