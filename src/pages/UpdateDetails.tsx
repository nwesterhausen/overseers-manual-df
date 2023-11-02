import { useNavigate } from '@solidjs/router';
import { invoke } from '@tauri-apps/api/primitives';
import { relaunch } from '@tauri-apps/plugin-process';
import { JSX, Show } from 'solid-js';
import { useUpdateProvider } from '../providers/UpdateProvider';

function UpdateDetails(): JSX.Element {
  const updateContext = useUpdateProvider();
  const navigate = useNavigate();

  return (
    <div class='prose p-8 mx-auto'>
      <Show
        when={updateContext.update.latest.currentVersion !== updateContext.update.latest.version}
        fallback={<h1>No Update Available</h1>}>
        <h1>Update to {updateContext.update.latest.version}</h1>
      </Show>
      <pre class='my-10'>{updateContext.update.latest.body.trim()}</pre>
      <p>
        Full changelog available{' '}
        <a href='https://github.com/nwesterhausen/overseers-manual-df/blob/main/docs/CHANGELOG.md' target='_blank'>
          online
        </a>
        .
      </p>
      <div class='flex flex-row justify-between'>
        <button
          class='btn btn-secondary'
          onClick={() => {
            invoke('plugin:aptabase|track_event', {
              name: 'skip_update',
              props: {
                latestVersion: updateContext.update.latest.version,
                currentVersion: updateContext.update.latest.currentVersion,
              },
            });
            updateContext.skipUpdate();
            navigate('/');
          }}>
          Skip this version
        </button>
        <button
          class='btn btn-primary'
          onClick={async () => {
            await updateContext.update.latest.downloadAndInstall();
            await relaunch();
          }}>
          Download and Install
        </button>
      </div>
    </div>
  );
}

export default UpdateDetails;
