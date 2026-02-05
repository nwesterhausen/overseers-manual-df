<script lang="ts">
    import type {
        BiomeToken,
        Creature,
        Plant,
        RawObject,
    } from "bindings/DFRawParser";

    interface Props {
        raw: RawObject;
    }

    let { raw } = $props();
    let biomesExpanded = $state(false);
    const BIOME_LIMIT = 3;

    let displayInfo = $derived.by(() => {
        let biomes: BiomeToken[] = [];

        switch (raw.metadata.objectType) {
            case "Creature": {
                const creature = raw as unknown as Creature;
                biomes = creature.biomes ? creature.biomes : [];
                break;
            }
            case "Plant": {
                const plant = raw as unknown as Plant;
                biomes = plant.biomes ? plant.biomes : [];
                break;
            }
        }

        return { biomes };
    });
    let visibleBiomes = $derived(
        biomesExpanded
            ? displayInfo.biomes
            : displayInfo.biomes.slice(0, BIOME_LIMIT),
    );
</script>

{#if displayInfo.biomes.length > 0}
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
{/if}
