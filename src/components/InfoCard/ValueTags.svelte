<script lang="ts">
    import type { Creature, Plant, RawObject } from "bindings/DFRawParser";

    interface Props {
        raw: RawObject;
    }

    let { raw } = $props();

    let displayInfo = $derived.by(() => {
        let valueTags: string[] = [];

        switch (raw.metadata.objectType) {
            case "Creature": {
                const creature = raw as unknown as Creature;
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
                break;
            }
        }

        return { valueTags };
    });
</script>

{#if displayInfo.valueTags.length > 0}
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
{/if}
