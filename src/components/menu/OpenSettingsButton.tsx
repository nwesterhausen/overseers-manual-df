import { A, useLocation } from '@solidjs/router';
import { BiRegularCog } from 'solid-icons/bi';
import { Component } from 'solid-js';

const OpenSettingsButton: Component = () => {
  const location = useLocation();
  return (
    <div class='tooltip tooltip-left' data-tip={location.pathname === '/' ? 'Open Settings' : 'Close Settings'}>
      <A class='btn btn-sm btn-circle btn-ghost hover:text-accent' href={location.pathname === '/' ? '/settings' : '/'}>
        <BiRegularCog size={'1.5rem'} />
      </A>
    </div>
  );
};

export default OpenSettingsButton;
