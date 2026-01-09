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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Search Results</span
        >
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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Object Types</span
        >
        <div class="flex flex-wrap gap-4 w-full mx-5">
            {#each typeOptions as option}
                <label
                    class="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 px-2 rounded-lg transition-colors"
                >
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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Search Locations</span
        >
        <div class="flex flex-wrap gap-4 w-full mx-5">
            {#each locationOptions as option}
                <label
                    class="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 px-2 rounded-lg transition-colors"
                >
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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Required Flags</span
        >
    </div>
    <div>
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Required Values</span
        >
    </div>
</div>
