import { Stack } from 'solid-bootstrap';
import { Component, For } from 'solid-js';

const AlphaLinks: Component<{ alphabet: string[]; id: string }> = (props) => {
  return (
    <Stack direction='horizontal' class='d-flex justify-content-center' gap={3}>
      <For each={props.alphabet} fallback={<></>}>
        {(letter) => (
          <a class='listing-nav' href={`#${props.id}-${letter}`}>
            {letter.toUpperCase()}
          </a>
        )}
      </For>
    </Stack>
  );
};

export default AlphaLinks;
