import { Form } from 'solid-bootstrap';
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
          <Form.Check
            type='switch'
            id={`${filterTag}-enabled`}
            label={filterTag.description}
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
        )}
      </For>
    </div>
  );
};

export default TagIncludeFilter;
