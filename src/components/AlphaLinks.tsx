import { Nav } from 'solid-bootstrap';
import { Component, For } from 'solid-js';

const AlphaLinks: Component<{ alphabet: string[]; id: string }> = (props) => {
  return (
    <Nav variant='pills' class='d-flex justify-content-center letter-nav'>
      <For each={props.alphabet} fallback={<></>}>
        {(letter) => (
          <Nav.Item>
            <Nav.Link eventKey={`${props.id}-${letter}`}>{letter.toUpperCase()}</Nav.Link>
          </Nav.Item>
        )}
      </For>
      {props.alphabet.length > 0 ? (
        <Nav.Item>
          <Nav.Link eventKey={`${props.id}-all`}>{'all'.toUpperCase()}</Nav.Link>
        </Nav.Item>
      ) : (
        <></>
      )}
    </Nav>
  );
};

export default AlphaLinks;
