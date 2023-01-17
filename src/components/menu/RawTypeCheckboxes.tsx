import { Dropdown, Form, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { TbTrees } from 'solid-icons/tb';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const RawTypeCheckboxes: Component<{ disabled: boolean }> = (props) => {
  const searchContext = useSearchProvider();

  return (
    <OverlayTrigger placement='bottom' overlay={<Tooltip>Restrict Object Types</Tooltip>}>
      <Dropdown autoClose='outside'>
        <Dropdown.Toggle
          variant='outline-secondary'
          class='border-0 p-1 ms-1'
          id='dropdown-basic'
          disabled={props.disabled}>
          <TbTrees size={'1.5rem'} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={searchContext.handleToggleRequireCreature}>
            <Form.Check type='switch' label='Creatures' checked={searchContext.requireCreature()} />
          </Dropdown.Item>
          <Dropdown.Item onClick={searchContext.handleToggleRequirePlant}>
            <Form.Check type='switch' label='Plants' checked={searchContext.requirePlant()} />
          </Dropdown.Item>
          <Dropdown.Item onClick={searchContext.handleToggleRequireInorganic}>
            <Form.Check type='switch' label='Inorganics' checked={searchContext.requireInorganic()} />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </OverlayTrigger>
  );
};

export default RawTypeCheckboxes;
