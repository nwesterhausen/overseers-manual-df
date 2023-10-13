import { Component } from 'solid-js';

const AppDrawerContent: Component = () => {
  return (
    <div class='drawer-side'>
      <label for='my-drawer' aria-label='close sidebar' class='drawer-overlay'></label>
      <ul class='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
        {/* <!-- Sidebar content here --> */}
        <li>
          <div class='menu-title'>App Functionality</div>
        </li>
        <li>
          <a>Reference Manual</a>
        </li>
        <li>
          <a>
            <code>info.txt</code> Utility
          </a>
        </li>
        <li>
          <a>Raw Viewer</a>
        </li>
        <li>
          <a>Embark Planning</a>
        </li>
      </ul>
    </div>
  );
};

export default AppDrawerContent;
