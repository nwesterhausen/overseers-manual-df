<script lang="ts">
    import type { Creature, Plant, RawObject } from "../bindings/DFRawParser";
    import { toTitleCase } from "../helpers";

    interface Props {
        raw: RawObject;
    }

    let { raw }: Props = $props();
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
        <h2 class="card-title">{toTitleCase(displayInfo.title, true)}</h2>
        <p>{displayInfo.description}</p>
        <div class="card-actions justify-end">
            <span class="text-xs absolute left-1.5 bottom-1.5"
                >{displayInfo.objectType} Raw</span
            >
            <button
                class="btn btn-primary btn-xs"
                onclick={() => console.log(displayInfo.rawJson)}
                >Show Details</button
            >
        </div>
    </div>
</div>
