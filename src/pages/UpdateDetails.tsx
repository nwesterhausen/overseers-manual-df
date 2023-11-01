import { trackEvent } from '@aptabase/tauri';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { JSX, Show, createResource } from 'solid-js';
import { NO_UPDATE } from '../lib/Constants';

function UpdateDetails(): JSX.Element {
  const [update] = createResource(
    async () => {
      const updateCheck = await check();
      if (updateCheck) {
        trackEvent('update_available', { version: updateCheck.version });
        return updateCheck;
      } else {
        return NO_UPDATE;
      }
    },
    {
      initialValue: NO_UPDATE,
    },
  );
  return (
    <div class='prose p-8 mx-auto'>
      <Show when={update.latest.currentVersion !== update.latest.version} fallback={<h1>No Update Available</h1>}>
        <h1>Update to {update.latest.version}</h1>
      </Show>
      <pre class='my-10'>{update.latest.body.trim()}</pre>
      <p>
        Full changelog available{' '}
        <a href='https://github.com/nwesterhausen/overseers-manual-df/blob/main/docs/CHANGELOG.md' target='_blank'>
          online
        </a>
        .
      </p>
      <div class='flex flex-row justify-between'>
        <button class='btn btn-secondary' onClick={() => trackEvent('skip_update', { version: update.latest.version })}>
          Skip this version
        </button>
        <button
          class='btn btn-primary'
          onClick={async () => {
            await update.latest.downloadAndInstall();
            await relaunch();
          }}>
          Download and Install
        </button>
      </div>
    </div>
  );
}

export default UpdateDetails;
