import { useNavigate } from '@solidjs/router';
import { Update, check } from '@tauri-apps/plugin-updater';
import { BiRegularDownload } from 'solid-icons/bi';
import { Component, Show, createSignal } from 'solid-js';

const UpdateAvailable: Component = () => {
  const [updater, setUpdater] = createSignal<Update | null>(null);
  check().then(setUpdater).catch(console.error);
  const navigate = useNavigate();
  return (
    <Show when={updater()}>
      <div class='tooltip tooltip-left' data-tip={`Update Available: Version ${updater().version}`}>
        <button
          class='btn btn-sm btn-ghost btn-circle hover:text-accent'
          onClick={async () => {
            navigate('/update-details');
          }}>
          <BiRegularDownload size={'1.5rem'} />
        </button>
      </div>
    </Show>
  );
};

export default UpdateAvailable;
