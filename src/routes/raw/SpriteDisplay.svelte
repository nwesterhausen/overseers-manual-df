<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/core";
    import { getGraphics } from "bindings/Commands";
    import type { GraphicsResult } from "bindings/Structs";
    import { toTitleCase } from "helpers";

    let { identifier } = $props<{ identifier: string }>();
    let spriteData = $state<GraphicsResult[]>([]);
    let loading = $state(true);

    $effect(() => {
        loading = true;
        // Pass null so Rust uses the 1:1 native size
        getGraphics(identifier, null)
            .then((data) => {
                spriteData = data;
                loading = false;
            })
            .catch((error) => {
                console.error(error);
                loading = false;
            });
    });
</script>

<div class="space-y-4 mt-8">
    <h3
        class="text-xs font-bold uppercase opacity-50 tracking-widest border-b border-base-300 pb-2"
    >
        Full Graphic Gallery
    </h3>

    {#if loading}
        <div class="flex justify-center p-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else}
        <div class="flex flex-wrap gap-8 items-end">
            {#each spriteData as sprite}
                <div class="flex flex-col items-center gap-2">
                    <div
                        class="bg-black/40 border border-base-300 rounded shadow-lg overflow-hidden"
                        style:width="{sprite.aspectRatio.x *
                            sprite.tileDimensions.x}px"
                        style:height="{sprite.aspectRatio.y *
                            sprite.tileDimensions.y}px"
                    >
                        <div
                            class="w-full h-full"
                            style:background-image="url('{convertFileSrc(
                                sprite.filePath,
                            )}')"
                            style:background-position={sprite.bgPosition}
                            style:background-size={sprite.bgSize}
                            style:background-repeat="no-repeat"
                            style:image-rendering="pixelated"
                        ></div>
                    </div>
                    <span class="text-[0.6rem] font-mono text-accent uppercase"
                        >{toTitleCase(sprite.description, true)}</span
                    >
                </div>
            {/each}
        </div>
    {/if}
</div>
