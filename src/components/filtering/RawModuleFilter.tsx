import { Button, Form } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { labelForModule } from '../../definitions/Raw';
import { useRawsProvider } from '../../providers/RawsProvider';
import { useSearchProvider } from '../../providers/SearchProvider';

const RawModuleFilter: Component = () => {
  const searchContext = useSearchProvider();
  const rawsContext = useRawsProvider();

  return (
    <div>
      <legend>
        <div class='d-flex'>
          <div>Enabled Raw Modules</div>
        </div>
      </legend>
      <div class='m-2 hstack gap-2'>
        <Button size='sm' variant='secondary' onClick={() => searchContext.addFilteredModule(rawsContext.rawModulesInfo.latest.map(m => m.identifier))}>
          Clear All
        </Button>
        <Button size='sm' variant='danger' onClick={searchContext.removeAllFilteredModules}>
          Reset
        </Button>
      </div>
      <For each={rawsContext.rawModules()}>
        {(objectId) => (
          <Form.Check
            type='switch'
            id={`${objectId}-enabled`}
            label={labelForModule(rawsContext.rawModulesInfo.latest.find(v => v.objectId === objectId))}
            checked={searchContext.filteredModules().indexOf(rawsContext.rawModulesInfo.latest.find(v => v.objectId === objectId).identifier) === -1}
            onChange={(event) => {
              const el = event.target as HTMLInputElement;
              const module = rawsContext.rawModulesInfo.latest.find(v => v.objectId === objectId);
              if (el.checked) {
                searchContext.removeFilteredModule(module.identifier);
              } else {
                searchContext.addFilteredModule(module.identifier);
              }
            }}
          />
        )}
      </For>
    </div>
  );
};

export default RawModuleFilter;
