import { ProgressBar } from "solid-bootstrap";
import { Component, createMemo } from "solid-js";
import { STS_PARSING, useRawsProvider } from "../providers/RawsProvider";

const ParsingProgressBar: Component = () => {
    const rawsContext = useRawsProvider();
    const percentage = createMemo(() => {
        if (rawsContext.currentStatus() === STS_PARSING) {
            return Math.floor(100 * rawsContext.parsingProgress().percentage);
        }
        return 0;
    })
    const current = createMemo(() => {
        return rawsContext.parsingProgress().current_module;
    })
    return (
        <ProgressBar now={percentage()} label={`${percentage()}% (${current()})`} animated />
    )
}

export default ParsingProgressBar;