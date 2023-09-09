import { TbTrees } from 'solid-icons/tb';
import { Component } from 'solid-js';
import { useSearchProvider } from '../../providers/SearchProvider';

const RawTypeCheckboxes: Component<{ disabled: boolean }> = (props) => {
  const searchContext = useSearchProvider();

  return (
    <div class='tooltip tooltip-bottom' data-tip='Filter by raw type'>
      <details class='dropdown'>
        <summary
          class='btn btn-sm btn-ghost btn-circle  text-secondary'
          classList={{ disabled: props.disabled }}
          id='dropdown-basic'>
          <TbTrees size={'1.5rem'} />
        </summary>
        <div class='p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 z-[1]'>
          <div class='flex flex-col'>
            <div>
              <a onClick={searchContext.handleToggleRequireCreature}>
                <label class='cursor-pointer label'>
                  <span class='label-text'>Creatures</span>
                  <input type='checkbox' class='toggle toggle-xs' checked={searchContext.requireCreature()} />
                </label>
              </a>
            </div>
            <div>
              <a onClick={searchContext.handleToggleRequirePlant}>
                <label class='cursor-pointer label'>
                  <span class='label-text'>Plants</span>
                  <input type='checkbox' class='toggle toggle-xs' checked={searchContext.requirePlant()} />
                </label>
              </a>
            </div>
            <div>
              <a onClick={searchContext.handleToggleRequireInorganic}>
                <label class='cursor-pointer label'>
                  <span class='label-text'>Inorganics</span>
                  <input type='checkbox' class='toggle toggle-xs' checked={searchContext.requireInorganic()} />
                </label>
              </a>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default RawTypeCheckboxes;
