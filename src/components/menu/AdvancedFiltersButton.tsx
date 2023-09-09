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
        onclick={() => {
          const dialog = document.getElementById('searchFilterModal') as HTMLDialogElement;
          dialog.showModal();
        }}>
        <IoOptionsSharp size={'1.5rem'} />
        <Show when={searchContext.advancedFiltering()}>
          <div class='text-warning absolute right-0 -top-2 m-0 p-0 text-xl'>•</div>
        </Show>
      </button>
    </div>
  );
};

export default AdvancedFiltersButton;
