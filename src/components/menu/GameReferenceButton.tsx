import { IoHelpCircleSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import ZoneOverview from '../quickReference/ZoneOverview';

const GameReferenceButton: Component<{ disabled: boolean }> = (props) => {
  return (
    <>
      <div class='tooltip tooltip-left' data-tip='Open Quick Game Reference'>
        <button
          classList={{ disabled: props.disabled }}
          class='btn btn-sm btn-circle btn-ghost fill-secondary'
          onClick={() => {
            const dialog = document.getElementById('_game-ref-dialog') as HTMLDialogElement;
            dialog?.showModal();
          }}>
          <IoHelpCircleSharp size={'1.5rem'} />
        </button>
      </div>

      <dialog id='_game-ref-dialog' class='modal'>
        <div class='modal-box w-11/12 max-w-5xl'>
          <ZoneOverview />
        </div>
        <form method='dialog' class='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default GameReferenceButton;
