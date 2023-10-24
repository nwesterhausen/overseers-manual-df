import { appDataDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/primitives';
import { BiSolidFolderOpen } from 'solid-icons/bi';
import { Component, createResource } from 'solid-js';
import DirectoryOptions from '../components/settings/DirectoryOptions';
import DisplayOptions from '../components/settings/DisplayOptions';
import LocationOptions from '../components/settings/LocationOptions';
import ObjectTypeOptions from '../components/settings/ObjectTypeOptions';
import SavedSettingsDataTable from '../components/settings/SavedSettingsDataTable';
import { useSettingsContext } from '../providers/SettingsProvider';

const Settings: Component = () => {
  const [_settings, { resetToDefaults }] = useSettingsContext();

  const [settingsFilePath] = createResource<string>(
    async () => {
      const baseDir = await appDataDir();
      if (baseDir.indexOf('\\') !== -1) {
        return baseDir + '\\settings.json';
      }
      return baseDir + '/settings.json';
    },
    { initialValue: '' },
  );

  return (
    <div class='p-2 flex flex-col gap-3'>
      <section class='bg-slate-800 bg-opacity-75 rounded-lg p-2'>
        <h3 class='text-lg font-semibold mb-2'>Parsing Options</h3>
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Location Options</legend>
        <LocationOptions />
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Object Type Inclusion Options</legend>
        <ObjectTypeOptions />
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Display Options</legend>
        <DisplayOptions />
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Directory</legend>
        <DirectoryOptions />
      </section>

      <section class='bg-slate-800 bg-opacity-75 rounded-lg p-2'>
        <legend class='font-semibold font-md my-1'>Stored Data</legend>
        <div class='join join-vertical gap-3 w-full'>
          <p>Settings are persisted to disk. You can delete them here if you want to reset the application.</p>
          <div class='flex flex-row'>
            <div class='p-2 text-slate-400 text-opacity-75 flex-grow'>{`${settingsFilePath.latest}`}</div>
            <div class='tooltip tooltip-left' data-tip='Show in Explorer'>
              <button
                class='btn btn-sm btn-primary btn-outline border-none'
                onClick={() => {
                  invoke('show_in_folder', {
                    path: settingsFilePath.latest,
                  }).catch(console.error);
                }}>
                <BiSolidFolderOpen />
              </button>
            </div>
          </div>
          <SavedSettingsDataTable />
        </div>
        <div class='flex justify-around my-2'>
          <button class='btn btn-sm btn-error self-center' onClick={() => resetToDefaults()}>
            Clear All Stored Data (Reset to Defaults)
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
