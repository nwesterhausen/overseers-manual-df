import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoOptionsSharp } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const AdvancedFiltersButton: Component<{ disabled: boolean }> = (props) => {
  const searchContext = useSearchProvider();

  return (
    <OverlayTrigger placement='bottom' overlay={<Tooltip>Open Advanced Filters</Tooltip>}>
      <Button
        disabled={props.disabled}
        class='border-0 p-1 ms-1'
        style={{ position: 'relative' }}
        variant='outline-secondary'
        onClick={searchContext.handleToggleAdvancedFilters}>
        <IoOptionsSharp size={'1.5rem'} />
        <Show when={searchContext.advancedFiltering()}>
          <div class='badge-dot' />
        </Show>
      </Button>
    </OverlayTrigger>
  );
};

export default AdvancedFiltersButton;
