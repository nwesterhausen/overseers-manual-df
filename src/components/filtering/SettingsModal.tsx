import { getTauriVersion } from '@tauri-apps/api/app';
import { Button, Form, Modal } from 'solid-bootstrap';
import { Component, For, Show, createResource } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';
import { useSettingsContext } from '../../providers/SettingsProvider';
import { PATH_STRING, PATH_TYPE, clear } from '../../settings';

const SettingsModal: Component = () => {
  const [settings, { handleClose }] = useSettingsContext();
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
          <em>Note: not currently able to be changed.</em>

          <Form.Group controlId='settingsEnableVanilla'>
            <Form.Check
              checked
              disabled
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
              checked
              disabled
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
              checked
              disabled
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
              <Show when={directoryContext.directoryHistory().length > 0} fallback='None set'>
                {directoryContext.currentDirectory().path.join('/')}
              </Show>
            </code>
          </p>
          <p>
            <Show when={directoryContext.directoryHistory().length > 1} fallback={<em>No previous directories</em>}>
              Previous directories:{' '}
              <ul>
                <For each={directoryContext.directoryHistory().slice(1, -1)}>
                  {(dirSelection, index) => (
                    <li>
                      {dirSelection.path.join('/')}{' '}
                      <Button
                        onClick={() => directoryContext.promoteDirectoryFromHistory(index())}
                        variant='outline-primary'>
                        Promote
                      </Button>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
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
