<script lang="ts">
    import { areDeeplyEqual } from "helpers";
    import { typeOptions } from "options";
    import { searchState } from "state/search.svelte";
    import { defaultSearchState } from "state/searchDefaults.svelte";
</script>

<div class="custom-checkbox-container">
    {#each typeOptions as option}
        <label class="custom-checkbox-label">
            <input
                type="checkbox"
                class="checkbox checkbox-primary checkbox-sm"
                value={option.value}
                bind:group={searchState.query.rawTypes}
            />
            <span class="text-sm select-none">{option.label}</span>
        </label>
    {/each}

    {#if !areDeeplyEqual(searchState.query.rawTypes, defaultSearchState.rawTypes)}
        <button
            onclick={() =>
                (searchState.query.rawTypes = defaultSearchState.rawTypes)}
            class="btn btn-ghost btn-xs text-error"
        >
            Reset to Default
        </button>
    {/if}
</div>
