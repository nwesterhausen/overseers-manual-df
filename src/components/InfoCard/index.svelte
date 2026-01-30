<script lang="ts">
    import type {
        BiomeToken,
        Creature,
        Plant,
        RawObject,
    } from "bindings/DFRawParser";
    import { toTitleCase } from "helpers";
    import SpriteImage from "./SpriteImage.svelte";
    import { ChevronDown, Star } from "@lucide/svelte";
    import { favorites } from "state/favorites.svelte";
    import ActionMenu from "./ActionMenu.svelte";

    interface Props {
        raw: RawObject;
        rawId: string;
    }

    let { raw, rawId }: Props = $props();
    let biomesExpanded = $state(false);
    const BIOME_LIMIT = 3;

    const mockTags = ["Edible Raw", "Edible Cooked", "Brewable"];
    const mockValueTags = ["Value: 2", "Growth: 100"];

    let displayInfo = $derived.by(() => {
        let title = raw.identifier;
        let description = "No description available.";
        let objectType = raw.metadata.objectType as string;
        let biomes: BiomeToken[] = [];
        let flags: string[] = mockTags;
        let valueTags: string[] = mockValueTags;
        let module =
            raw.metadata.moduleName + " v" + raw.metadata.moduleVersion;
        let objectId = raw.objectId;

        switch (raw.metadata.objectType) {
            case "Creature": {
                const creature = raw as unknown as Creature;
                title = creature.name.singular || raw.identifier;
                description = creature.castes
                    .map((c) => c.description)
                    .filter(Boolean)
                    .join(" ");
                biomes = creature.biomes ? creature.biomes : [];
                valueTags = [
                    "Pet value: " +
                        creature.castes.find((c) => c.identifier === "ALL")
                            ?.petValue,
                    "Egg size: " +
                        creature.castes.find((c) => c.identifier === "ALL")
                            ?.eggSize,
                    "Frequency: " + creature.frequency,
                ];
                break;
            }
            case "Plant": {
                const plant = raw as unknown as Plant;
                title = plant.name.singular;
                description = plant.prefStrings?.length
                    ? `Liked for its ${plant.prefStrings.join(", ")}.`
                    : description;
                biomes = plant.biomes ? plant.biomes : [];
                break;
            }
        }

        return {
            title,
            description,
            objectType,
            module,
            biomes,
            flags,
            valueTags,
            objectId,
        };
    });
    let visibleBiomes = $derived(
        biomesExpanded
            ? displayInfo.biomes
            : displayInfo.biomes.slice(0, BIOME_LIMIT),
    );
    let isFavorite = $derived(favorites.has(rawId));
</script>

<div class="card info-card">
    <div class="tooltip tooltip-down absolute top-1 left-1" data-tip="Favorite">
        <button
            class="btn btn-ghost h-4 p-0"
            onclick={() => favorites.toggle(rawId)}
            ><Star
                class="w-4 h-4"
                fill={isFavorite ? "#ffff00" : "#00000000"}
            /></button
        >
    </div>
    <div class="card-body gap-3">
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h2 class="info-card-title">
                    {toTitleCase(displayInfo.title, true)}
                </h2>
                <p class="info-card-module-title">
                    {displayInfo.module}
                </p>
            </div>
            <div class="shrink-0">
                <SpriteImage identifier={raw.identifier} />
            </div>
        </div>

        <div class="flex-1 space-y-3">
            <p class="text-sm text-base-content/80 leading-snug">
                {displayInfo.description}
            </p>
            {#if displayInfo.biomes.length > 0}
                <div>
                    <h3 class="info-card-subheading">Biomes</h3>
                    <div class="flex flex-wrap gap-1">
                        {#each visibleBiomes as biome}
                            <span class="badge info-tag-badge">{biome}</span>
                        {/each}
                        {#if displayInfo.biomes.length > BIOME_LIMIT}
                            <button
                                onclick={() =>
                                    (biomesExpanded = !biomesExpanded)}
                                class="btn btn-ghost btn-xs text-[10px] h-5 min-h-0 px-2 hover:bg-accent/20 text-accent"
                            >
                                {biomesExpanded
                                    ? "... Show Less"
                                    : `+${displayInfo.biomes.length - BIOME_LIMIT} more`}
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}
            <div>
                <h3 class="info-card-subheading">Tags</h3>
                <div class="flex flex-wrap gap-1">
                    {#each displayInfo.flags as tag}
                        <span class="badge info-tag-badge">{tag}</span>
                    {/each}
                </div>
            </div>

            <div>
                <h3 class="info-card-subheading">Value Tags</h3>
                <div class="flex flex-wrap gap-1">
                    {#each displayInfo.valueTags as vTag}
                        <div class="join">
                            <span class="badge join-item info-tag-badge">
                                {vTag.split(":")[0]}
                            </span>
                            <span class="badge join-item info-tag-badge">
                                {vTag.split(":")[1]?.trim() || ""}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="card-actions place-content-end">
            <span class="text-xs font-mono absolute left-1.25 bottom-1"
                >{displayInfo.objectType}</span
            >
            <span
                style="font-size:0.5rem"
                class="text-primary/75 font-mono absolute right-1.25 bottom-1"
                >{displayInfo.objectId}</span
            >

            <div class="join">
                <ActionMenu {rawId} />
            </div>
        </div>
    </div>
</div>

<style>
    @reference '../../routes/layout.css';

    .info-card {
        @apply w-80 bg-base-200 shadow-xl border border-base-300;
    }
    .info-card-title {
        @apply card-title text-xl font-bold leading-tight;
    }
    .info-card-module-title {
        @apply text-xs italic text-accent font-medium;
    }
    .info-card-subheading {
        @apply text-[10px] font-bold text-info uppercase tracking-wider mb-1;
    }
    .info-tag-badge {
        @apply badge-sm border-secondary text-[10px];
    }
</style>
