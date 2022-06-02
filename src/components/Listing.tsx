import { Component, createSignal, For } from 'solid-js';

const Listing: Component<{data: any[]}> = (props) => {
    // const [pages, setPages] = createSignal([]);
    return (
        <ul>
        <For each={props.data} fallback={<div>No items</div>}>{(item, i) =>
        <li data-objId={item.objectId}>
            {item.identifier}
            </li>
        }</For>
        </ul>
    );
};

export default Listing;