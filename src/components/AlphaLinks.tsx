import { Nav } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { useRawsProvider } from '../providers/RawsProvider';

const AlphaLinks: Component<{ id: string }> = (props) => {
  const rawsContext = useRawsProvider();

  return (
    <Nav variant='pills' class='d-flex justify-content-center letter-nav'>
      <For each={rawsContext.rawsAlphabet()} fallback={<></>}>
        {(letter) => (
          <Nav.Item>
            <Nav.Link eventKey={`${props.id}-${letter}`}>{letter.toUpperCase()}</Nav.Link>
          </Nav.Item>
        )}
      </For>
      {rawsContext.rawsAlphabet().length > 0 ? (
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
