import { Button, Modal } from 'solid-bootstrap';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';
import TagIncludeFilter from './TagIncludeFilter';

const TagFilterModal: Component = () => {
    const searchContext = useSearchProvider();
    return (
        <Modal show={searchContext.showTagFilters()} onHide={searchContext.handleHideTagFilters()}>
            <Modal.Header closeButton>
                Require Raws to have Tags
            </Modal.Header>
            <Modal.Body>
                <TagIncludeFilter />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={() => {
                    // reset raw module filters
                    searchContext.removeAllRequiredTagFilters();
                    // reset anything else
                }}>
                    Reset All
                </Button>
                <Button variant='secondary' onClick={searchContext.handleHideTagFilters}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TagFilterModal;
