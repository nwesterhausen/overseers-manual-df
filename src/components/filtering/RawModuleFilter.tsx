import { Component, For } from 'solid-js';
import { labelForModule } from '../../definitions/Raw';
import { useRawsProvider } from '../../providers/RawsProvider';
import { useSearchProvider } from '../../providers/SearchProvider';

const RawModuleFilter: Component = () => {
  const searchContext = useSearchProvider();
  const rawsContext = useRawsProvider();

  return (
    <div>
      <div class='flex flex-row'>
        <div class='me-2 font-bold flex-1 align-middle'>Enabled Raw Modules</div>
        <div class='m-2 join'>
          <button
            class='btn join-item btn-xs btn-secondary'
            onClick={() => searchContext.addFilteredModule(rawsContext.rawModulesInfo.latest.map((m) => m.identifier))}>
            Uncheck All
          </button>
          <button class='btn join-item btn-xs btn-error' onClick={searchContext.removeAllFilteredModules}>
            Reset
          </button>
        </div>
      </div>
      <For each={rawsContext.rawModules()}>
        {(objectId) => (
          <div>
            <label class='label cursor-pointer'>
              <span class='label-text'>
                {labelForModule(rawsContext.rawModulesInfo.latest.find((v) => v.objectId === objectId))}
              </span>
              <input
                type='checkbox'
                id={`${objectId}-enabled`}
                checked={
                  searchContext
                    .filteredModules()
                    .indexOf(rawsContext.rawModulesInfo.latest.find((v) => v.objectId === objectId).identifier) === -1
                }
                onChange={(event) => {
                  const el = event.target as HTMLInputElement;
                  const module = rawsContext.rawModulesInfo.latest.find((v) => v.objectId === objectId);
                  if (el.checked) {
                    searchContext.removeFilteredModule(module.identifier);
                  } else {
                    searchContext.addFilteredModule(module.identifier);
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

export default RawModuleFilter;
