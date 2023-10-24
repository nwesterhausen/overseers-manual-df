import { BiRegularMenu } from 'solid-icons/bi';
import { Component } from 'solid-js';

const AppDrawerButton: Component = () => {
  return (
    <div>
      <label for='my-drawer' class='btn btn-ghost btn-sm btn-circle drawer-button'>
        <BiRegularMenu size={'1.5rem'} />
      </label>
    </div>
  );
};

export default AppDrawerButton;
