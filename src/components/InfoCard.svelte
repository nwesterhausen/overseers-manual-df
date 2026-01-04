<script lang="ts">
    import type { Creature, RawObject } from "../bindings/DFRawParser";

    interface Props {
        raw: RawObject;
    }

    let { raw }: Props = $props();
    // Use $derived to keep title and description in sync with the 'raw' prop
    let displayInfo = $derived.by(() => {
        let title = raw.identifier; // Default fallback
        let description = "No description available.";

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
            // You can add more cases here as you implement other RawObject types
        }

        return { title, description };
    });
</script>

<div class="card card-compact w-72 bg-neutral/25">
    <div class="card-body">
        <h2 class="card-title">{displayInfo.title}</h2>
        <p>{displayInfo.description}</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary btn-xs">Show Details</button>
        </div>
    </div>
</div>
