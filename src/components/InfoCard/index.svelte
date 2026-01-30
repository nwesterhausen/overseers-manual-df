<script lang="ts">
    import type { Creature, Plant, RawObject } from "bindings/DFRawParser";
    import { toTitleCase } from "helpers";
    import SpriteImage from "./SpriteImage.svelte";
    import { favorites } from "state/favorites.svelte";
    import ActionMenu from "./ActionMenu.svelte";
    import Biomes from "./Biomes.svelte";
    import ValueTags from "./ValueTags.svelte";
    import Flags from "./Flags.svelte";
    import { Star } from "@lucide/svelte";

    interface Props {
        raw: RawObject;
        rawId: string;
    }

    let { raw, rawId }: Props = $props();

    let displayInfo = $derived.by(() => {
        let title = raw.identifier;
        let description = "No description available.";
        let objectType = raw.metadata.objectType as string;
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
                break;
            }
            case "Plant": {
                const plant = raw as unknown as Plant;
                title = plant.name.singular;
                description = plant.prefStrings?.length
                    ? `Liked for its ${plant.prefStrings.join(", ")}.`
                    : description;
                break;
            }
        }

        return {
            title,
            description,
            objectType,
            module,
            objectId,
        };
    });
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
            <Biomes {raw} />
            <Flags {raw} />
            <ValueTags {raw} />
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
