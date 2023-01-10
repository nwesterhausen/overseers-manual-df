import { Offcanvas } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';
import RawModuleFilter from './RawModuleFilter';

const SearchFilters: Component = () => {
  const searchContext = useSearchProvider();

  return (
    <Offcanvas show={searchContext.showAdvancedFilters()} onHide={searchContext.handleHideAdvancedFilters}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Additional Filtering Options</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <RawModuleFilter />
      </Offcanvas.Body>
    </Offcanvas >
  );
};

export default SearchFilters;
