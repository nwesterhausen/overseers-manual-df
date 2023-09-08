import { debounce } from '@solid-primitives/scheduled';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const SearchBox: Component<{ disabled: boolean }> = (props) => {
  const searchContext = useSearchProvider();

  return (
    <div class='form-control'>
      <input
        disabled={props.disabled}
        class='input input-sm'
        id='search-box'
        type='search'
        placeholder='Type here to search'
        aria-label='Search'
        onInput={debounce((event: Event) => {
          const targetEl = event.target as HTMLInputElement;
          searchContext.setSearchString(targetEl.value.toLowerCase());
        }, 100)}
      />
    </div>
  );
};

export default SearchBox;
