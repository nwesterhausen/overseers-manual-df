import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { CgTag } from 'solid-icons/cg';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const TagRestrictionButton: Component<{ disabled: boolean }> = (props) => {
  const _searchContext = useSearchProvider();
  return (
    <OverlayTrigger placement='bottom' overlay={<Tooltip>Show Only a Specific Tag</Tooltip>}>
      <Button disabled={props.disabled} variant='outline-secondary' class='border-0 p-1 ms-1'>
        <CgTag size={'1.5rem'} />
      </Button>
    </OverlayTrigger>
  );
};

export default TagRestrictionButton;
