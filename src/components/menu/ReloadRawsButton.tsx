import { IoRefreshSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useRawsProvider } from '../../providers/RawsProvider';

const ReloadRawsButton: Component<{ disabled: boolean }> = (props) => {
  const rawsContext = useRawsProvider();
  return (
    <div class='tooltip tooltip-bottom' data-tip='Re-read Raw Modules'>
      <button
        class='btn btn-sm btn-ghost btn-circle text-secondary'
        classList={{ disabled: props.disabled }}
        onClick={() => rawsContext.forceLoadRaws()}>
        <IoRefreshSharp size={'1.5rem'} />
      </button>
    </div>
  );
};

export default ReloadRawsButton;
