<script lang="ts">
    import { slide } from "svelte/transition";
    import { resetSearchState, searchState } from "state/search.svelte";
    import SearchLocations from "./SearchLocations.svelte";
    import ObjectTypes from "./ObjectTypes.svelte";
    import RequiredFlags from "./RequiredFlags.svelte";
</script>

<div
    transition:slide={{ duration: 300 }}
    class="bg-base-200 border-b border-base-300 shadow-inner"
>
    <div class="container mx-auto p-4 flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Column: Checkbox filters -->
            <div class="flex flex-col gap-4">
                <span class="text-xs section-heading">Object Types</span>
                <ObjectTypes />
                <span class="text-xs section-heading">Search Locations</span>
                <SearchLocations />
            </div>

            <!-- Right Column: Tag Inputs -->
            <div class="flex flex-col gap-2">
                <span class="text-xs section-heading"
                    >Required Flags (Tokens)</span
                >
                <RequiredFlags />

                <!-- Add valued flags here -->
            </div>
        </div>
    </div>

    <div class="flex justify-end pt-2 border-t border-base-300">
        <button
            class="btn btn-ghost btn-xs text-error"
            onclick={resetSearchState}
        >
            Reset All to Default
        </button>
    </div>
</div>
