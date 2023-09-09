import { Component, Show } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';
import { useSettingsContext } from '../../providers/SettingsProvider';
import { PATH_STRING, PATH_TYPE, clear } from '../../settings';

const SettingsModal: Component = () => {
  const [settings, { toggleIncludeLocationInstalledMods, toggleIncludeLocationMods, toggleIncludeLocationVanilla }] =
    useSettingsContext();
  const directoryContext = useDirectoryProvider();

  return (
    <dialog class='modal' id='settingsModal'>
      <div class='modal-box modal90w'>
        <h3 class='font-bold text-lg'>Settings</h3>
        <section>
          <legend class='font-semibold font-md my-1'>Parsing Options</legend>
          <div class='flex flex-col'>
            <div class='form-control'>
              <label class='cursor-pointer label'>
                <span class='label-text'>
                  Parse vanilla raw modules from <code>$DF_DIR/data/vanilla</code>
                </span>
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
              <label class='cursor-pointer label'>
                <span class='label-text'>
                  Parse installed raw modules from <code>$DF_DIR/data/installed_mods</code>
                </span>
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
              <label class='cursor-pointer label'>
                <span class='label-text'>
                  Parse workshop raw modules from <code>$DF_DIR/mods</code>
                </span>
                <input
                  type='checkbox'
                  class='toggle toggle-primary'
                  name='settingsEnableWorkshop'
                  checked={settings.includeLocationMods}
                  onClick={toggleIncludeLocationMods}
                />
              </label>
            </div>
          </div>
        </section>
        <section>
          <legend class='font-semibold font-md my-1'>Directories</legend>
          <p class='my-2'>
            Current Dwarf Fortress Directory:{' '}
            <code class='font-bold text-secondary'>
              <Show when={directoryContext.currentDirectory().path.length > 0} fallback='None set'>
                {directoryContext.currentDirectory().path.join('/')}
              </Show>
            </code>
          </p>
        </section>
        <section>
          <legend class='font-semibold font-md my-1'>Stored Data</legend>
          <div class='flex flex-row py-2'>
            <p class='flex-1'>
              The previous used Dwarf Fortress directory is saved in a file on disk to remember the next time you open
              this app.
            </p>
            <button
              class='btn btn-sm btn-error btn-outline self-center'
              onClick={async () => {
                await clear(PATH_STRING);
                await clear(PATH_TYPE);
              }}>
              Clear All Stored Data
            </button>
          </div>
        </section>
        <section>
          <legend class='font-semibold font-md my-1'>About</legend>
          <p class='my-2'>This app was made with the following open source projects:</p>
          <div class='join join-vertical gap-1'>
            <div class='join-item'>Tauri</div>
            <div class='join-item'>SolidJS</div>
            <div class='join-item'>TailwindCSS</div>
            <div class='join-item'>DaisyUI</div>
          </div>
          <p class='my-2'>
            The parsing is accomplished with the <code>dfraw_json_parser</code> library.
          </p>
        </section>
      </div>
      <form method='dialog' class='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SettingsModal;
