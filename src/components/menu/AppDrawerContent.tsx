import { A } from '@solidjs/router';
import { getTauriVersion, getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/primitives';
import { Component, createMemo, createResource } from 'solid-js';
import { Info } from '../../definitions/Info';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';

const AppDrawerContent: Component = () => {
  const [buildInfo] = createResource<Info>(
    async () => {
      return await invoke('get_build_info');
    },
    {
      initialValue: {
        buildTime: '',
        gitCommitHash: '',
        dependencies: [],
        inDebug: false,
        optimizationLevel: '',
        rustVersion: '',
        version: '',
      },
    },
  );
  const [appVersion] = createResource(
    async () => {
      return await getVersion();
    },
    {
      initialValue: '0.0.0',
    },
  );
  const [tauriVersion] = createResource(
    async () => {
      return await getTauriVersion();
    },
    {
      initialValue: '2.0.0',
    },
  );
  const dfrawJsonVersion = createMemo(() => {
    if (buildInfo.latest.dependencies.length > 0) {
      // dependencies are laid out in Array of Array[2] where [0] is the name and [1] is the version
      const dfrawJsonDep = buildInfo.latest.dependencies.find((dep) => dep[0] === 'dfraw_json_parser');
      if (dfrawJsonDep) {
        return dfrawJsonDep[1];
      }
    }
    return 'unknown';
  });
  const directoryContext = useDirectoryProvider();
  return (
    <div class='drawer-side'>
      <label for='my-drawer' aria-label='close sidebar' class='drawer-overlay'></label>
      <ul class='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
        {/* <!-- Sidebar content here --> */}
        <li>
          <div class='menu-title'>App Functionality</div>
        </li>
        <li>
          <A href='/' activeClass='font-bold ps-6 bg-primary'>
            Reference Manual
          </A>
        </li>
        <li class='disabled'>
          <a>
            <code>info.txt</code> Utility
          </a>
        </li>
        <li class='disabled'>
          <a>Raw Viewer</a>
        </li>
        <li class='disabled'>
          <a>Embark Planning</a>
        </li>
        <li>
          <div class='menu-title'>App Settings</div>
        </li>
        <li>
          <a
            onClick={() => {
              directoryContext.activateManualDirectorySelection(true);
            }}>
            {(directoryContext.currentDirectory().path.length > 0 ? 'Change ' : 'Set ') + ' Game Directory'}
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              const dialog = document.getElementById('settingsModal') as HTMLDialogElement;
              dialog.showModal();
            }}>
            Open Settings
          </a>
        </li>
      </ul>
      {/* Show some details about the app */}
      <ul class='menu-xs mt-auto mb-2 ms-2'>
        <li>
          <div class='menu-item'>
            App Version: <span class='text-accent'>{appVersion.latest}</span>
          </div>
        </li>
        <li>
          <div class='menu-item'>
            Built with Tauri <span class='text-accent'>{tauriVersion.latest}</span>
          </div>
        </li>
        <li>
          <div class='menu-item'>
            Using dfraw_json_parser <span class='text-accent'>{dfrawJsonVersion()}</span>
          </div>
        </li>
        <li>
          <div class='menu-item'>
            Commit <span class='text-secondary'>{buildInfo.latest.gitCommitHash}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AppDrawerContent;
