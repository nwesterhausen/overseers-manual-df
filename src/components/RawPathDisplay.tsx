import { ListGroup } from "solid-bootstrap";
import { Component, For } from "solid-js";

const RawPathDisplay: Component<{ path: string[] }> = (props) => {
    const path = props.path;
    return (
    <div class="d-flex flex-row">
            <For each={path} fallback={<div>Error parsing path</div>}>
                {(item) => <div class="p-2 ">{item}</div>}
            </For>
        </div>
    )
};

export default RawPathDisplay;