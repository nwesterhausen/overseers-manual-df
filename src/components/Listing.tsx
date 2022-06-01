import { Component, createSignal, For } from 'solid-js';

const Listing: Component = () => {
    const [pages, setPages] = createSignal([]);
    return (
        <ul>
        <For each={pages()} fallback={<div>No items</div>}>{(name, i) =>
        <li>
            <a href={`/raws&name=${name}`}>{name} ({i})</a>
            </li>
        }</For>
        </ul>
    );
};

export default Listing;