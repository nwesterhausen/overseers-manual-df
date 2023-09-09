import { Component } from 'solid-js';
import RawModuleFilter from './RawModuleFilter';
import TagIncludeFilter from './TagIncludeFilter';

const SearchFilters: Component = () => {
  return (
    <dialog class='modal' id='searchFilterModal'>
      <div class='modal-box'>
        <h3 class='font-bold text-lg'>Additional Filtering Options</h3>
        <p class='py-4'>Press ESC key or click outside to close</p>
        <RawModuleFilter />
        <TagIncludeFilter />
      </div>
      <form method='dialog' class='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SearchFilters;
