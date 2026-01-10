<script lang="ts">
    import type { Creature, Plant, RawObject } from "bindings/DFRawParser";
    import { toTitleCase } from "helpers";
    import SpriteImage from "./SpriteImage.svelte";

    interface Props {
        raw: RawObject;
        raw_id: string;
    }

    let { raw, raw_id }: Props = $props();
    // Use $derived to keep title and description in sync with the 'raw' prop
    let displayInfo = $derived.by(() => {
        let title = raw.identifier; // Default fallback
        let description = "No description available.";
        let objectType = raw.metadata.objectType as string;
        let rawJson = raw;

        switch (raw.metadata.objectType) {
            case "Creature": {
                // Type narrowing: Cast to Creature to access specific fields
                const creature = raw as unknown as Creature;
                title = creature.name.singular || raw.identifier;
                // Join descriptions from all castes
                description = creature.castes
                    .map((c) => c.description)
                    .filter(Boolean)
                    .join(" ");
                break;
            }
            case "Plant": {
                const plant = raw as unknown as Plant;
                title = plant.name.singular;
                if (
                    typeof plant.prefStrings !== "undefined" &&
                    plant.prefStrings !== null
                ) {
                    if (plant.prefStrings.length > 1) {
                        description =
                            "Liked for its " +
                            plant.prefStrings.slice(0, -1).join(", ") +
                            ", and " +
                            plant.prefStrings.slice(-1) +
                            ".";
                    } else {
                        description =
                            "Liked for its " + plant.prefStrings.join("");
                    }
                }
                break;
            }
        }

        return { title, description, objectType, rawJson };
    });
</script>

<div class="card card-compact w-72 bg-neutral/25">
    <div class="card-body">
        <div
            class="card-title flex flex-wrap items-start justify-between gap-2"
        >
            <span class="flex-1 min-w-7/12">
                {toTitleCase(displayInfo.title, true)}
            </span>
            <div class="shrink-0">
                <SpriteImage identifier={raw.identifier} />
            </div>
        </div>
        <p>{displayInfo.description}</p>
        <div class="card-actions justify-end">
            <span class="text-xs absolute left-1.5 bottom-1.5"
                >{displayInfo.objectType} Raw</span
            >
            <a class="btn btn-primary btn-xs" href="/raw/{raw_id}"
                >Show Details</a
            >
        </div>
    </div>
</div>
