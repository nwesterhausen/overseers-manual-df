<script lang="ts">
    import type {
        BiomeTag,
        CreatureTag,
        Creature,
        Plant,
        RawObject,
    } from "bindings/DFRawParser";
    import { toTitleCase } from "helpers";
    import SpriteImage from "./SpriteImage.svelte";
    import { ChevronDown } from "@lucide/svelte";

    interface Props {
        raw: RawObject;
        raw_id: string;
    }

    let { raw, raw_id }: Props = $props();
    let biomesExpanded = $state(false);
    const BIOME_LIMIT = 3;

    const mockTags = ["Edible Raw", "Edible Cooked", "Brewable"];
    const mockValueTags = ["Value: 2", "Growth: 100"];

    let displayInfo = $derived.by(() => {
        let title = raw.identifier;
        let description = "No description available.";
        let objectType = raw.metadata.objectType as string;
        let biomes: BiomeTag[] = [];
        let flags: string[] = mockTags;
        let valueTags: string[] = mockValueTags;
        let module =
            raw.metadata.moduleName + " v" + raw.metadata.moduleVersion;

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
        };
    });
    let visibleBiomes = $derived(
        biomesExpanded
            ? displayInfo.biomes
            : displayInfo.biomes.slice(0, BIOME_LIMIT),
    );
</script>

<div class="card info-card">
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

        <p class="text-sm text-base-content/80 leading-snug">
            {displayInfo.description}
        </p>

        <div class="space-y-3">
            <div>
                <h3 class="info-card-subheading">Biomes</h3>
                <div class="flex flex-wrap gap-1">
                    {#each visibleBiomes as biome}
                        <span class="badge info-tag-badge">{biome}</span>
                    {/each}
                    {#if displayInfo.biomes.length > BIOME_LIMIT}
                        <button
                            onclick={() => (biomesExpanded = !biomesExpanded)}
                            class="btn btn-ghost btn-xs text-[10px] h-5 min-h-0 px-2 hover:bg-accent/20 text-accent"
                        >
                            {biomesExpanded
                                ? "... Show Less"
                                : `+${displayInfo.biomes.length - BIOME_LIMIT} more`}
                        </button>
                    {/if}
                </div>
            </div>

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
            <span class="text-xs absolute left-1.5 bottom-1.5"
                >{displayInfo.objectType} Raw</span
            >

            <div class="join">
                <a class="btn btn-primary btn-xs join-item" href="/raw/{raw_id}"
                    >More Detail</a
                >
                <div class="dropdown dropdown-top dropdown-end">
                    <details>
                        <summary
                            class="btn btn-primary btn-xs join-item border-l-primary-focus list-none"
                        >
                            <ChevronDown class="w-4 h-4" />
                        </summary>
                        <ul
                            class="dropdown-content z-1 menu p-1 shadow bg-base-100 rounded-box w-40 text-xs"
                        >
                            <li>
                                <button type="button">Open Raw File</button>
                            </li>
                            <li>
                                <button type="button">Search Module</button>
                            </li>
                            <li><button type="button">Find Similar</button></li>
                            <div class="divider my-0"></div>
                            <li>
                                <button type="button">View Raw (JSON)</button>
                            </li>
                            <li>
                                <button type="button">View Raw (Parsed)</button>
                            </li>
                        </ul>
                    </details>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @reference '../routes/layout.css';

    .info-card {
        @apply w-80 bg-base-200 shadow-xl border border-base-300;
    }
    .info-card-title {
        @apply card-title text-xl font-bold leading-tight;
    }
    .info-card-module-title {
        @apply text-xs italic text-secondary font-medium;
    }
    .info-card-subheading {
        @apply text-[10px] font-bold text-accent uppercase tracking-wider mb-1;
    }
    .info-tag-badge {
        @apply badge-neutral badge-sm text-[10px];
    }
</style>
