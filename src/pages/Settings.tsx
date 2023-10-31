import { appDataDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/primitives';
import { BiSolidFolderOpen } from 'solid-icons/bi';
import { Component, createResource } from 'solid-js';
import RawLocationCheckboxes from '../components/filtering/RawLocationCheckboxes';
import RawTypeCheckboxes from '../components/filtering/RawTypeCheckboxes';
import DirectoryOptions from '../components/settings/DirectoryOptions';
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
        <p>
          Set restrictions for when the raws are parsed. To filter results after searching, use the filters on the main
          page.
        </p>
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Locations</legend>
        <div class='grid grid-cols-1 sm:grid-cols-2 mb-3'>
          <RawLocationCheckboxes parsingOnly />
        </div>
        <hr class='mt-4 opacity-25' />

        <legend class='font-semibold text-md my-1'>Object Type Inclusion</legend>
        <div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-3'>
          <RawTypeCheckboxes parsingOnly />
        </div>
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
