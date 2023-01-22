import { getTauriVersion } from '@tauri-apps/api/app';
import { Button, Form, Modal } from 'solid-bootstrap';
import { Component, Show, createResource } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';
import { useSettingsContext } from '../../providers/SettingsProvider';
import { PATH_STRING, PATH_TYPE, clear } from '../../settings';

const SettingsModal: Component = () => {
  const [
    settings,
    { handleClose, toggleIncludeLocationInstalledMods, toggleIncludeLocationMods, toggleIncludeLocationVanilla },
  ] = useSettingsContext();
  const directoryContext = useDirectoryProvider();

  const [appInfo] = createResource(
    async (): Promise<string> => {
      const tauriVersion = await getTauriVersion();

      return ' ' + tauriVersion;
    },
    { initialValue: '' }
  );

  return (
    <Modal fullscreen onHide={handleClose} show={settings.show}>
      <Modal.Header closeButton>Settings</Modal.Header>
      <Modal.Body class='settings-window'>
        <section>
          <legend>Parsing Options</legend>

          <Form.Group controlId='settingsEnableVanilla'>
            <Form.Check
              checked={settings.includeLocationVanilla}
              onClick={toggleIncludeLocationVanilla}
              type='checkbox'
              label={
                <p>
                  Parse vanilla raw modules from <code>$DF_DIR/data/vanilla</code>
                </p>
              }
            />
          </Form.Group>

          <Form.Group controlId='settingsEnableInstalled'>
            <Form.Check
              checked={settings.includeLocationInstalledMods}
              onClick={toggleIncludeLocationInstalledMods}
              type='checkbox'
              label={
                <p>
                  Parse installed raw modules from <code>$DF_DIR/data/installed_mods</code>
                </p>
              }
            />
          </Form.Group>
          <Form.Group controlId='settingsEnableWorkshop'>
            <Form.Check
              checked={settings.includeLocationMods}
              onClick={toggleIncludeLocationMods}
              type='checkbox'
              label={
                <p>
                  Parse workshop raw modules from <code>$DF_DIR/mods</code>
                </p>
              }
            />
          </Form.Group>
        </section>
        <section>
          <legend>Directories</legend>
          <p>
            Current Dwarf Fortress Directory:{' '}
            <code>
              <Show when={directoryContext.currentDirectory().path.length > 0} fallback='None set'>
                {directoryContext.currentDirectory().path.join('/')}
              </Show>
            </code>
          </p>
        </section>
        <section>
          <legend>Stored Data</legend>
          <p>
            The previous used Dwarf Fortress directory is saved in a file on disk to remember the next time you open
            this app.
          </p>
          <Button
            variant='danger'
            onClick={async () => {
              await clear(PATH_STRING);
              await clear(PATH_TYPE);
            }}>
            Clear All Stored Data
          </Button>
        </section>
        <section>
          <legend>About</legend>
          <p>
            This app was made with Tauri{appInfo} and SolidJS. The parsing is accomplished with the{' '}
            <code>dfraw_json_parser</code> library.
          </p>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
