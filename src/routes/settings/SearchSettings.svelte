<script lang="ts">
    import { locationOptions, typeOptions } from "searchOptions";
    import { searchState } from "state/search.svelte";
    import { defaultSearchState } from "state/searchDefaults.svelte";
</script>

<div class="flex flex-wrap gap-4 flex-col w-9/12">
    <p class="py-4 text-sm">
        Override the deafult search parameters. These get applied when resetting
        the search filter to Default and will also be applied when opening the
        application.
    </p>
    <div>
        <span class="text-xs section-heading">Search Results</span>
        <label class="input w-full mx-5">
            <span class="label">Results per Page</span>
            <input
                type="number"
                placeholder="30"
                bind:value={defaultSearchState.limit}
            />
        </label>
    </div>
    <div>
        <span class="text-xs section-heading">Object Types</span>
        <div class="custom-checkbox-container">
            {#each typeOptions as option}
                <label class="custom-checkbox-label">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary checkbox-sm"
                        value={option.value}
                        bind:group={defaultSearchState.raw_types}
                    />
                    <span class="text-sm select-none">{option.label}</span>
                </label>
            {/each}
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Search Locations</span>
        <div class="custom-checkbox-container">
            {#each locationOptions as option}
                <label class="custom-checkbox-label">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary checkbox-sm"
                        value={option.value}
                        bind:group={defaultSearchState.locations}
                    />
                    <span class="text-sm select-none">{option.label}</span>
                </label>
            {/each}
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Required Flags</span>
    </div>
    <div>
        <span class="text-xs section-heading">Required Values</span>
    </div>
</div>
