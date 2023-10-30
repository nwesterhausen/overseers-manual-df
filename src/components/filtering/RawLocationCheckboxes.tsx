import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const RawLocationCheckboxes: Component = () => {
  const [settings, { toggleIncludeLocationInstalledMods, toggleIncludeLocationMods, toggleIncludeLocationVanilla }] =
    useSettingsContext();
  return (
    <>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <span class='label-text'>Vanilla Raws</span>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableVanilla'
            checked={settings.includeLocationVanilla}
            onClick={toggleIncludeLocationVanilla}
          />
        </label>
      </div>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <span class='label-text'>Installed Mod Raws</span>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableInstalled'
            checked={settings.includeLocationInstalledMods}
            onClick={toggleIncludeLocationInstalledMods}
          />
        </label>
      </div>
      <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <span class='label-text'>Downloaded Mod Raws</span>
          <input
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsEnableWorkshop'
            checked={settings.includeLocationMods}
            onClick={toggleIncludeLocationMods}
          />
        </label>
      </div>
    </>
  );
};

export default RawLocationCheckboxes;
