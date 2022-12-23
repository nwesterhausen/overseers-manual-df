import { Button, Form } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';

const RawModuleFilter: Component = () => {
  const rawsContext = useRawsProvider();
  return (
    <div>
      <legend>
        <div class='d-flex'>
          <div>Enabled Raw Modules</div>
          <div class='ms-auto'>
            <Button size='sm' variant='danger' onClick={rawsContext.removeAllRawModuleFilters}>
              Reset
            </Button>
          </div>
        </div>
      </legend>
      <For each={rawsContext.rawModules()}>
        {(module) => (
          <Form.Check
            type='switch'
            id={`${module}-enabled`}
            label={module}
            checked={rawsContext.rawModuleFilters().indexOf(module) === -1}
            onChange={(event) => {
              const el = event.target as HTMLInputElement;
              if (el.checked) {
                rawsContext.removeRawModuleFilter(module);
              } else {
                rawsContext.addRawModuleFilter(module);
              }
            }}
          />
        )}
      </For>
    </div>
  );
};

export default RawModuleFilter;
