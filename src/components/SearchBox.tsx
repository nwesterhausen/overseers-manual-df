import { debounce } from '@solid-primitives/scheduled';
import { Button, Form } from 'solid-bootstrap';
import { BsCardList } from 'solid-icons/bs';
import { IoOptionsSharp, IoPricetagSharp } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';
import { useSearchProvider } from '../providers/SearchProvider';

const SearchBox: Component = () => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  return (
    <Show when={rawsContext.parsingStatus() === STS_IDLE}>
      <div class='vstack gap-2'>
        <Form.Control
          type='search'
          placeholder='Type here to search'
          aria-label='Search'
          onInput={debounce((event: Event) => {
            const targetEl = event.target as HTMLInputElement;
            searchContext.setSearchString(targetEl.value.toLowerCase());
          }, 100)}
        />

        <div class='hstack gap-2 button-icon-adjust-25 ms-auto me-auto'>
          <Button
            class='border-0 p-1'
            style={{ position: 'relative' }}
            variant='outline-primary'
            onClick={searchContext.handleToggleSearchFilters}>
            <IoOptionsSharp size={'1.5rem'} />
            <span> Included Modules</span>
            <Show when={rawsContext.rawModuleFilters().length > 0}>
              <div class='badge-dot' />
            </Show>
          </Button>

          <Button
            class='border-0 p-1'
            style={{ position: 'relative' }}
            variant='outline-primary'
            onClick={searchContext.handleToggleTagFilters}>
            <IoPricetagSharp size={'1.5rem'} />
            <span> Restrict Results by Tag</span>
            <Show when={searchContext.requiredTagFilters().length > 0}>
              <div class='badge-dot' />
            </Show>
          </Button>

          <Button disabled
            class='border-0 p-1'
            style={{ position: 'relative' }}
            variant='outline-primary'
            onClick={searchContext.handleToggleCardDetails}>
            <BsCardList size={'1.5rem'} />
            <span> Card Details</span>
            <Show when={false}>
              <div class='badge-dot' />
            </Show>
          </Button>
        </div>
      </div>
    </Show>
  );
};

export default SearchBox;
