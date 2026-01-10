<script lang="ts">
    import {
        ArrowLeft,
        ArrowRight,
        ChevronLeft,
        ChevronRight,
    } from "@lucide/svelte";
    import { invoke, convertFileSrc } from "@tauri-apps/api/core";
    import type { Dimensions } from "bindings/DFRawParser";
    import type { GraphicsResult } from "bindings/Structs";
    import { toTitleCase } from "helpers";

    let { identifier } = $props<{ identifier: string }>();

    let spriteData = $state<GraphicsResult[]>([]);
    let currentIdx = $state(0); // idx in sprite data
    let rotationInterval = 4;

    $effect(() => {
        invoke<GraphicsResult[]>("get_graphics", { identifier })
            .then((data) => (spriteData = data))
            .catch((error) => console.log(error));
    });

    setInterval(() => {
        if (spriteData.length === 0) return;

        currentIdx = (currentIdx + 1) % spriteData.length;
    }, rotationInterval * 1000);

    function backgroundPositionFromOffset(positionOffset: Dimensions): string {
        return `${positionOffset.x}px ${positionOffset.y}px`;
    }
</script>

<div>
    <span class="tx-xs"
        >{spriteData.length > currentIdx
            ? toTitleCase(spriteData[currentIdx].description, true)
            : "No sprites"}</span
    >
    <div class="w-9 h-9 border-2 border-accent rounded-lg bg-black/50 relative">
        {#if spriteData.length >= currentIdx && spriteData.length > 1}
            <div
                class="w-8 h-8"
                style:background-image={"url(" +
                    convertFileSrc(spriteData[currentIdx].filePath) +
                    ")"}
                style:background-position={backgroundPositionFromOffset(
                    spriteData[currentIdx].positionOffset,
                )}
            ></div>
            <button
                type="button"
                class="absolute inset-y-0 -right-3"
                onclick={() => {
                    currentIdx = (currentIdx + 1) % spriteData.length;
                }}
            >
                <ChevronRight
                    strokeWidth={4}
                    class="hover:text-base-200 text-primary h-3.5 w-3.5"
                />
            </button>
            <button
                type="button"
                class="absolute inset-y-0 -left-3"
                onclick={() => {
                    currentIdx =
                        (currentIdx - 1 + spriteData.length) %
                        spriteData.length;
                }}
            >
                <ChevronLeft
                    strokeWidth={4}
                    class="hover:text-base-200 text-primary h-3.5 w-3.5"
                />
            </button>
        {/if}

        <span
            class="absolute -bottom-3 -left-6 text-center text-accent w-20"
            style:font-size="0.5rem"
            style:line-height="0.5rem"
        >
            {spriteData.length > currentIdx
                ? toTitleCase(spriteData[currentIdx].description, true)
                : "No Graphic"}
        </span>
    </div>
</div>
