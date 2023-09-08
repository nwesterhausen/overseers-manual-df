import { IoOptionsSharp } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const AdvancedFiltersButton: Component<{ disabled: boolean }> = (props) => {
  const searchContext = useSearchProvider();

  return (
    <div class='tooltip tooltip-bottom' data-tip='Open Advanced Filters'>
      <button
        classList={{ disabled: props.disabled }}
        class='btn btn-sm btn-ghost btn-circle  fill-secondary'
        onclick={searchContext.handleToggleAdvancedFilters}>
        <IoOptionsSharp size={'1.5rem'} />
        <Show when={searchContext.advancedFiltering()}>
          <div class='badge-dot' />
        </Show>
      </button>
    </div>
  );
};

export default AdvancedFiltersButton;
