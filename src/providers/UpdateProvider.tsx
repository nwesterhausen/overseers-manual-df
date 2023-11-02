import { createContextProvider } from '@solid-primitives/context';
import { check } from '@tauri-apps/plugin-updater';
import { createResource, createSignal } from 'solid-js';
import { NO_UPDATE } from '../lib/Constants';

export const [UpdateProvider, useUpdateProvider] = createContextProvider(() => {
  // Resource for the update status
  const [update, { refetch }] = createResource(
    async () => {
      const status = await check();
      if (typeof status !== 'undefined' && status !== null) {
        console.log(`⁂ Update Available: ${status.currentVersion} → ${status.version} ⁂`);
        return status;
      }
      return NO_UPDATE;
    },
    {
      initialValue: NO_UPDATE,
    },
  );

  // Signal to indicate update was skipped
  const [updateSkipped, setUpdateSkipped] = createSignal(false);

  function checkForUpdates() {
    refetch();
  }

  function skipUpdate() {
    setUpdateSkipped(true);
  }

  return {
    update,
    checkForUpdates,
    skipUpdate,
    updateSkipped,
  };
});
