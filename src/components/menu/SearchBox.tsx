import { debounce } from '@solid-primitives/scheduled';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const SearchBox: Component = () => {
  const searchContext = useSearchProvider();

  return (
    <div class='form-control w-full'>
      <input
        class='input input-sm input-bordered'
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
