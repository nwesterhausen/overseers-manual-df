import { IoMenuSharp } from 'solid-icons/io';
import { Component } from 'solid-js';

const AppDrawerButton: Component = () => {
  return (
    <div class='tooltip tooltip-right' data-tip='Open App Switch Menu'>
      <label for='my-drawer' class='btn btn-ghost btn-sm btn-circle fill-secondary drawer-button'>
        <IoMenuSharp size={'1.5rem'} />
      </label>
    </div>
  );
};

export default AppDrawerButton;
