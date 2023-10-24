import { A } from '@solidjs/router';
import { BiRegularCog } from 'solid-icons/bi';
import { Component } from 'solid-js';

const OpenSettingsButton: Component = () => {
  return (
    <div class='tooltip tooltip-left' data-tip='Open Settings'>
      <A class='btn btn-sm btn-circle btn-ghost fill-secondary' href='/settings'>
        <BiRegularCog size={'1.5rem'} />
      </A>
    </div>
  );
};

export default OpenSettingsButton;
