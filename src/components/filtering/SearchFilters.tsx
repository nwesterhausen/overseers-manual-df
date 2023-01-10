import { Offcanvas, Tab, Tabs } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';
import RawModuleFilter from './RawModuleFilter';
import TagIncludeFilter from './TagIncludeFilter';

const SearchFilters: Component = () => {
  const searchContext = useSearchProvider();

  return (
    <Offcanvas show={searchContext.showAdvancedFilters()} onHide={searchContext.handleHideAdvancedFilters}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Additional Filtering Options</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Tabs defaultActiveKey={'rawModules'}>
          <Tab title='Raw Modules' eventKey={'rawModules'}>
            <RawModuleFilter />
          </Tab>
          <Tab title='Tags' eventKey={'tags'}>
            <TagIncludeFilter />
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SearchFilters;
