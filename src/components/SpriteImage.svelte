<script lang="ts">
    import { invoke, convertFileSrc } from "@tauri-apps/api/core";
    import type { Dimensions } from "bindings/DFRawParser";
    import type { GraphicsResult } from "bindings/Structs";

    let { identifier } = $props<{ identifier: string }>();

    let spriteData = $state<GraphicsResult[]>([]);
    let currentIdx = $state(0); // idx in sprite data
    let rotationInterval = 1;

    $effect(() => {
        invoke<GraphicsResult[]>("get_graphics", { identifier })
            .then((data) => (spriteData = data))
            .catch((error) => console.log(error));
    });

    setInterval(() => {
        if (currentIdx === spriteData.length && currentIdx === 0) return;

        if (currentIdx >= spriteData.length) {
            currentIdx = 0;
        } else {
            currentIdx++;
        }
    }, rotationInterval * 1000);

    function backgroundPositionFromOffset(positionOffset: Dimensions): string {
        return `${positionOffset.x}px ${positionOffset.y}px`;
    }
</script>

<div>
    <span class="tx-xs"
        >{spriteData.length > currentIdx
            ? spriteData[currentIdx].description
            : "No sprites"}</span
    >
    {#if spriteData.length > currentIdx}
        <div
            class="w-8 h-8"
            style:background-image={convertFileSrc(
                spriteData[currentIdx].filePath,
            )}
            style:background-position={backgroundPositionFromOffset(
                spriteData[currentIdx].positionOffset,
            )}
        ></div>
    {/if}
</div>
