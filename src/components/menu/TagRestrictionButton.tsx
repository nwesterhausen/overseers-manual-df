import { CgTag } from 'solid-icons/cg';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const TagRestrictionButton: Component<{ disabled: boolean }> = (props) => {
  const _searchContext = useSearchProvider();
  return (
    <div class='tooltip tooltip-bottom' data-tip='Show Only a Specific Tag'>
      <button class='btn btn-sm btn-ghost text-secondary' classList={{ disabled: props.disabled }}>
        <CgTag size={'1.5rem'} />
      </button>
    </div>
  );
};

export default TagRestrictionButton;
