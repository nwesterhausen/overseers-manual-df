import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const BiomeCheckboxes: Component = () => {
  const [_settings, { toggleBiome, biomeIncluded }] = useSettingsContext();

  return (
    <>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <div class='join'>
            <span class='label-text'>BIOME NAME</span>
          </div>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableCreatureResults'
            checked={biomeIncluded('Creature')}
            onClick={() => toggleBiome('Creature')}
          />
        </label>
      </div>
    </>
  );
};

export default BiomeCheckboxes;
