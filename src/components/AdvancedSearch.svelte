<script lang="ts">
    import { slide } from "svelte/transition";
    import { searchState } from "state/search.svelte";
    import type { ObjectType } from "bindings/DFRawParser";

    const typeOptions: { label: string; value: ObjectType }[] = [
        { label: "Creature", value: "Creature" },
        { label: "Plant", value: "Plant" },
        { label: "Material", value: "Inorganic" }, // Mapping Material to Inorganic
        { label: "Entity", value: "Entity" },
    ];
</script>

<div
    transition:slide={{ duration: 300 }}
    class="bg-base-200 border-b border-base-300 shadow-inner"
>
    <div class="container mx-auto p-4 flex flex-col gap-4">
        <div>
            <span class="text-xs font-bold uppercase opacity-60 block mb-2"
                >Object Types</span
            >
            <div class="flex flex-wrap gap-4">
                {#each typeOptions as option}
                    <label
                        class="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 px-2 rounded-lg transition-colors"
                    >
                        <input
                            type="checkbox"
                            class="checkbox checkbox-primary checkbox-sm"
                            value={option.value}
                            bind:group={searchState.raw_types}
                        />
                        <span class="text-sm select-none">{option.label}</span>
                    </label>
                {/each}

                {#if searchState.raw_types.length > 0}
                    <button
                        onclick={() => (searchState.raw_types = [])}
                        class="btn btn-ghost btn-xs text-error"
                    >
                        Clear Filters
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
