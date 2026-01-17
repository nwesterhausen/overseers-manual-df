<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/core";
    import { getGraphics } from "bindings/Commands";
    import type { GraphicsResult } from "bindings/Structs";
    import { toTitleCase } from "helpers";

    let { identifier } = $props<{ identifier: string }>();
    let spriteData = $state<GraphicsResult[]>([]);
    let loading = $state(true);

    const PREFERRED_ORDER = [
        "PORTRAIT MAIN",
        "DEFAULT",
        "CORPSE",
        "ANIMATED",
        "CHILD:PORTRAIT MAIN",
        "CHILD",
        "CHILD CORPSE",
        "CHILD ANIMATED",
    ];

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
    // Group sprites by their target
    /**
     * Groups sprites by Caste or Species and sorts alphabetically by description.
     */
    let groupedSprites = $derived.by(() => {
        // 1. Group the data
        const groups = spriteData.reduce(
            (acc, sprite) => {
                let key = "SPECIES";

                // Check if target_identifier contains ':' to extract CASTE
                if (
                    sprite.targetIdentifier &&
                    sprite.targetIdentifier.includes(":")
                ) {
                    key = sprite.targetIdentifier.split(":").pop() || "SPECIES";
                }

                if (!acc[key]) acc[key] = [];
                acc[key].push(sprite);
                return acc;
            },
            {} as Record<string, GraphicsResult[]>,
        );

        // Sort the items within each group
        for (const key in groups) {
            groups[key] = [...groups[key]].sort((a, b) => {
                const descA = a.description.toUpperCase();
                const descB = b.description.toUpperCase();

                const indexA = PREFERRED_ORDER.indexOf(descA);
                const indexB = PREFERRED_ORDER.indexOf(descB);

                // If both are in our list, sort by index
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only A is in the list, it comes first
                if (indexA !== -1) return -1;
                // If only B is in the list, it comes first
                if (indexB !== -1) return 1;
                // Otherwise, alphabetical fallback
                return descA.localeCompare(descB);
            });
        }

        return groups;
    });
</script>

<div class="mt-8">
    <div
        class="flex items-center justify-between border-b border-base-300 pb-2"
    >
        <h3 class="text-xs font-bold uppercase opacity-50 tracking-widest">
            Full Graphic Gallery
        </h3>
        <span class="badge badge-sm badge-outline"
            >{spriteData.length} Sprites Found</span
        >
    </div>

    {#if loading}
        <div class="flex justify-center p-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:else}
        <div class="grid grid-cols-1">
            {#each Object.entries(groupedSprites) as [group, sprites]}
                <div>
                    <h4
                        class="text-xs font-bold uppercase text-accent/80 relative top-1"
                    >
                        {group}
                    </h4>
                    <div
                        class="flex flex-wrap gap-6 items-end border-b-4 border-base-200 pt-2"
                    >
                        {#each sprites as sprite}
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
                                <span
                                    class="text-[0.6rem] font-mono text-accent uppercase text-center"
                                >
                                    {toTitleCase(sprite.description, true)}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
