import { Component, For } from 'solid-js';
import { FILTERABLE_TAGS } from '../../definitions/Tags';
import { useSearchProvider } from '../../providers/SearchProvider';

const TagIncludeFilter: Component = () => {
  const searchContext = useSearchProvider();

  return (
    <div>
      <legend>Required Tags</legend>
      <For each={FILTERABLE_TAGS}>
        {(filterTag) => (
          <div>
            <label class='label cursor-pointer'>
              <span class='label-text'>{filterTag.description} </span>
              <input
                type='checkbox'
                class='toggle'
                id={`${filterTag}-enabled`}
                checked={searchContext.requiredTags().indexOf(filterTag.tag) !== -1}
                onChange={(event) => {
                  const el = event.target as HTMLInputElement;
                  if (el.checked) {
                    console.log(`Adding ${filterTag.tag} to filter list`);
                    searchContext.addRequiredTag(filterTag.tag);
                  } else {
                    searchContext.removeRequiredTag(filterTag.tag);
                  }
                }}
              />
            </label>
          </div>
        )}
      </For>
    </div>
  );
};

export default TagIncludeFilter;
