<script lang="ts">
    import { slide } from "svelte/transition";
    import { resetSearchState, searchState } from "state/search.svelte";
    import { X } from "@lucide/svelte";
    import { defaultSearchState } from "state/searchDefaults.svelte";
    import { areDeeplyEqual } from "helpers";
    import { locationOptions, typeOptions } from "searchOptions";

    // Sample list of tags
    const allTags = [
        "FLIER",
        "EGG_LAYER",
        "FIREIMMUNE",
        "INTELLIGENT",
        "AMPHIBIOUS",
        "MAGMA_VISION",
        "LARGE_PREDATOR",
        "BENIGN",
        "COMMON_DOMESTIC",
    ];

    let tagInput = $state("");
    let showSuggestions = $state(false);

    // Derived list of tags that match the current input
    let filteredTags = $derived(
        tagInput.length > 0
            ? allTags.filter(
                  (t) =>
                      t.toLowerCase().includes(tagInput.toLowerCase()) &&
                      !searchState.requiredFlags.includes(t),
              )
            : [],
    );

    function addTag(tag: string) {
        if (!searchState.requiredFlags.includes(tag)) {
            searchState.requiredFlags = [...searchState.requiredFlags, tag];
        }
        tagInput = "";
        showSuggestions = false;
    }

    function removeTag(tag: string) {
        searchState.requiredFlags = searchState.requiredFlags.filter(
            (t) => t !== tag,
        );
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && filteredTags.length > 0) {
            addTag(filteredTags[0]);
        }
    }
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
                <div class="custom-checkbox-container">
                    {#each typeOptions as option}
                        <label class="custom-checkbox-label">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-primary checkbox-sm"
                                value={option.value}
                                bind:group={searchState.rawTypes}
                            />
                            <span class="text-sm select-none"
                                >{option.label}</span
                            >
                        </label>
                    {/each}

                    {#if !areDeeplyEqual(searchState.rawTypes, defaultSearchState.rawTypes)}
                        <button
                            onclick={() =>
                                (searchState.rawTypes =
                                    defaultSearchState.rawTypes)}
                            class="btn btn-ghost btn-xs text-error"
                        >
                            Reset to Default
                        </button>
                    {/if}
                </div>
                <span class="text-xs section-heading">Search Locations</span>
                <div class="custom-checkbox-container">
                    {#each locationOptions as option}
                        <label class="custom-checkbox-label">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-primary checkbox-sm"
                                value={option.value}
                                bind:group={searchState.locations}
                            />
                            <span class="text-sm select-none"
                                >{option.label}</span
                            >
                        </label>
                    {/each}

                    {#if !areDeeplyEqual(searchState.locations, defaultSearchState.locations)}
                        <button
                            onclick={() =>
                                (searchState.locations =
                                    defaultSearchState.locations)}
                            class="btn btn-ghost btn-xs text-error"
                        >
                            Reset to Default
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Right Column: Tag Inputs -->
            <div class="flex flex-col gap-2">
                <span class="text-xs section-heading"
                    >Required Flags (Tokens)</span
                >

                <div class="relative w-full">
                    <input
                        type="text"
                        placeholder="Add tag (e.g. FLIER)..."
                        class="input input-sm input-bordered w-full"
                        bind:value={tagInput}
                        onfocus={() => (showSuggestions = true)}
                        onblur={() =>
                            setTimeout(() => (showSuggestions = false), 200)}
                        onkeydown={handleKeydown}
                    />

                    {#if showSuggestions && filteredTags.length > 0}
                        <ul
                            class="absolute z-100 mt-1 menu bg-base-100 w-full rounded-box border border-base-300 shadow-xl max-h-48 overflow-y-auto"
                        >
                            {#each filteredTags as tag}
                                <li>
                                    <button
                                        onclick={() => addTag(tag)}
                                        class="text-sm py-2">{tag}</button
                                    >
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>

                <!-- Active Tags Badges -->
                <div class="flex flex-wrap gap-2 mt-2">
                    {#each searchState.requiredFlags as tag}
                        <div
                            class="badge badge-primary gap-1 pl-3 pr-1 py-3 h-auto"
                        >
                            <span class="text-xs font-mono">{tag}</span>
                            <button
                                class="btn btn-ghost btn-xs btn-circle hover:bg-primary-focus p-0 min-h-0 h-4 w-4"
                                onclick={() => removeTag(tag)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    {:else}
                        <span class="text-xs opacity-40 italic"
                            >No flags required.</span
                        >
                    {/each}
                </div>

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
