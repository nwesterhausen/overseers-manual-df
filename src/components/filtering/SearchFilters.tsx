import { Button, Modal } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useRawsProvider } from '../../providers/RawsProvider';
import { useSearchProvider } from '../../providers/SearchProvider';
import RawModuleFilter from './RawModuleFilter';

const SearchFilters: Component = () => {
  const searchContext = useSearchProvider();
  const rawsContext = useRawsProvider();
  return (
    <Modal show={searchContext.showSearchFilters()} onHide={searchContext.handleHideSearchFilters()}>
      <Modal.Header closeButton>
        <Modal.Title>Additional Filtering Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RawModuleFilter />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={() => {
          // reset raw module filters
          rawsContext.removeAllRawModuleFilters();
          // reset anything else
        }}>
          Reset All
        </Button>
        <Button variant='secondary' onClick={searchContext.handleHideSearchFilters}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchFilters;
