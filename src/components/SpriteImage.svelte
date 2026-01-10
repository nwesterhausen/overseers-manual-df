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
    import { settingsState } from "state/settings.svelte";

    let { identifier } = $props<{ identifier: string }>();

    let spriteData = $state<GraphicsResult[]>([]);
    let currentIdx = $state(0); // idx in sprite data
    let rotationInterval = 4; // in seconds, get's randomized within 1 second (.5 each way)
    let timerId: ReturnType<typeof setTimeout>;

    $effect(() => {
        invoke<GraphicsResult[]>("get_graphics", { identifier })
            .then((data) => (spriteData = data))
            .catch((error) => console.log(error));
    });

    // Start timer on mount and cleanup on destroy
    $effect(() => {
        if (spriteData.length > 1) {
            startRotation();
        }
        return () => clearTimeout(timerId);
    });

    /**
     * Cycle to the next image
     */
    function handleNext() {
        currentIdx = (currentIdx + 1) % spriteData.length;
        startRotation(); // Reset timer
    }

    /**
     * Cycle to the previous image
     */
    function handlePrev() {
        currentIdx = (currentIdx - 1 + spriteData.length) % spriteData.length;
        startRotation(); // Reset timer
    }

    /**
     * Transforms the Dimension into a valid value for the style property "background-position"
     * @param positionOffset dimension to transform
     */
    function backgroundPositionFromOffset(positionOffset: Dimensions): string {
        return `${positionOffset.x}px ${positionOffset.y}px`;
    }

    /**
     * Helper for the image rotation.
     *
     * - clears existing timeout
     * - randomizes the delay
     * - sets the next timeout
     */
    function startRotation() {
        clearTimeout(timerId);

        // No need to rotate if no images to cycle between
        if (spriteData.length <= 1) return;

        // Randomize: (4000) + (range of -500 to +500)
        const randomOffset = Math.random() * 1000 - 500;
        let delay = rotationInterval * 1000;
        if (settingsState.randomizeImageRotation) {
            delay = delay + randomOffset;
        }

        timerId = setTimeout(() => {
            if (spriteData.length > 0) {
                currentIdx = (currentIdx + 1) % spriteData.length;
            }
            startRotation(); // Schedule next tick
        }, delay);
    }
</script>

<div>
    <div
        class="w-9 h-9 border-2 border-accent rounded-lg bg-black/40 relative -top-2"
    >
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
            {#if spriteData.length > 1}
                <button
                    type="button"
                    class="absolute inset-y-0 -right-3"
                    onclick={handleNext}
                >
                    <ChevronRight
                        strokeWidth={4}
                        class="hover:text-base-200 text-primary h-3.5 w-3.5"
                    />
                </button>
                <button
                    type="button"
                    class="absolute inset-y-0 -left-3"
                    onclick={handlePrev}
                >
                    <ChevronLeft
                        strokeWidth={4}
                        class="hover:text-base-200 text-primary h-3.5 w-3.5"
                    />
                </button>
            {/if}
        {/if}

        <span
            class="absolute -bottom-3 -left-6 text-xs text-center text-accent w-20"
            style:font-size="0.5rem"
            style:line-height="0.5rem"
        >
            {spriteData.length > currentIdx
                ? toTitleCase(spriteData[currentIdx].description, true)
                : "No Graphic"}
        </span>
    </div>
</div>
