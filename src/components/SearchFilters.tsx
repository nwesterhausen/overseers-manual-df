import { Button, Modal } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';
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
        <Button variant='danger' onClick={rawsContext.removeAllRawModuleFilters}>
          Reset All
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchFilters;
