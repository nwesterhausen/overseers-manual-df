import { useNavigate } from '@solidjs/router';
import { BiRegularDownload } from 'solid-icons/bi';
import { Component, Show } from 'solid-js';
import { useUpdateProvider } from '../../providers/UpdateProvider';

const UpdateAvailable: Component = () => {
  const updateContext = useUpdateProvider();
  const navigate = useNavigate();

  return (
    <Show
      when={
        updateContext.update.latest.version !== updateContext.update.latest.currentVersion &&
        updateContext.updateSkipped() === false
      }>
      <div class='tooltip tooltip-left' data-tip={`Update Available: Version ${updateContext.update.latest.version}`}>
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
