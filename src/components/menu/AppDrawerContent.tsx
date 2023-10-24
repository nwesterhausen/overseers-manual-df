import { A, useMatch } from '@solidjs/router';
import { getTauriVersion, getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/primitives';
import { Component, createMemo, createResource } from 'solid-js';
import { Info } from '../../definitions/Info';

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
  const inSettings = useMatch(() => '/settings');
  const inMain = useMatch(() => '/');
  return (
    <div class='drawer-side'>
      <label for='my-drawer' aria-label='close sidebar' class='drawer-overlay'></label>
      <ul class='menu menu-vertical p-2 w-80 min-h-full bg-base-200 text-base-content'>
        {/* <!-- Sidebar content here --> */}
        <li>
          <A
            href='/'
            activeClass='bg-primary'
            classList={{
              'font-bold': Boolean(inMain()),
              'ps-6': Boolean(inMain()),
              'bg-primary': Boolean(inMain()),
            }}>
            Reference Manual
          </A>
        </li>
        <li>
          <A
            href='/settings'
            activeClass='bg-primary'
            classList={{
              'font-bold': Boolean(inSettings()),
              'ps-6': Boolean(inSettings()),
              'bg-primary': Boolean(inSettings()),
            }}>
            Settings
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
      </ul>
      {/* Show some details about the app */}
      <ul class='menu-xs mt-auto mb-2 ms-2 opacity-75'>
        <li>
          <div class='menu-item text-slate-400 flex flex-row'>
            <div>
              App Version: <span class='text-accent'>{appVersion.latest}</span>
            </div>
          </div>
        </li>
        <li>
          <div class='menu-item text-slate-400'>
            Built with Tauri <span class='text-accent'>{tauriVersion.latest}</span>
          </div>
        </li>
        <li>
          <div class='menu-item text-slate-400'>
            Using dfraw_json_parser <span class='text-accent'>{dfrawJsonVersion()}</span>
          </div>
        </li>
        <li>
          <div class='menu-item text-slate-400'>
            Commit <span class='text-secondary'>{buildInfo.latest.gitCommitHash}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AppDrawerContent;
