import { BiRegularFilter } from 'solid-icons/bi';
import { Component } from 'solid-js';
import BiomeCheckboxes from './BiomeCheckboxes';
import RawTypeCheckboxes from './RawTypeCheckboxes';

const ShowFilterButton: Component = () => {
  return (
    <details class='absolute top-0 left-0 dropdown'>
      <summary class='m-1 btn btn-xs'>
        <BiRegularFilter />
        Filters
      </summary>
      <div class='relative z-[1]'>
        <div class='join join-vertical w-full'>
          <div class='collapse collapse-arrow join-item bg-base-100'>
            <input type='radio' name='filter-accordion' checked />
            <div class='collapse-title font-medium'>Object Types</div>
            <div class='collapse-content'>
              <RawTypeCheckboxes />
            </div>
          </div>
          <div class='collapse collapse-arrow join-item bg-base-100'>
            <input type='radio' name='filter-accordion' />
            <div class='collapse-title font-medium'>Biomes</div>
            <div class='collapse-content'>
              <BiomeCheckboxes />
            </div>
          </div>
        </div>
      </div>
    </details>
  );
};

export default ShowFilterButton;
