import { A } from '@solidjs/router';
import { IoCogSharp } from 'solid-icons/io';
import { Component } from 'solid-js';

const OpenSettingsButton: Component = () => {
  return (
    <div class='tooltip tooltip-left' data-tip='Open Settings'>
      <A class='btn btn-sm btn-circle btn-ghost fill-secondary' href='/settings'>
        <IoCogSharp size={'1.5rem'} />
      </A>
    </div>
  );
};

export default OpenSettingsButton;
