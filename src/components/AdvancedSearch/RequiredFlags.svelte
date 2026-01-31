<script lang="ts">
    import { X } from "@lucide/svelte";
    import { searchState } from "state/search.svelte";

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
                      !searchState.query.requiredFlags.includes(t),
              )
            : [],
    );

    function addTag(tag: string) {
        if (!searchState.query.requiredFlags.includes(tag)) {
            searchState.query.requiredFlags = [
                ...searchState.query.requiredFlags,
                tag,
            ];
        }
        tagInput = "";
        showSuggestions = false;
    }

    function removeTag(tag: string) {
        searchState.query.requiredFlags =
            searchState.query.requiredFlags.filter((t) => t !== tag);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && filteredTags.length > 0) {
            addTag(filteredTags[0]);
        }
    }
</script>

<div class="relative w-full">
    <input
        type="text"
        placeholder="Add tag (e.g. FLIER)..."
        class="input input-sm input-bordered w-full"
        bind:value={tagInput}
        onfocus={() => (showSuggestions = true)}
        onblur={() => setTimeout(() => (showSuggestions = false), 200)}
        onkeydown={handleKeydown}
    />

    {#if showSuggestions && filteredTags.length > 0}
        <ul
            class="absolute z-100 mt-1 menu bg-base-100 w-full rounded-box border border-base-300 shadow-xl max-h-48 overflow-y-auto"
        >
            {#each filteredTags as tag}
                <li>
                    <button onclick={() => addTag(tag)} class="text-sm py-2"
                        >{tag}</button
                    >
                </li>
            {/each}
        </ul>
    {/if}
</div>
<!-- Active Tags Badges -->
<div class="flex flex-wrap gap-2 mt-2">
    {#each searchState.query.requiredFlags as tag}
        <div class="badge badge-primary gap-1 pl-3 pr-1 py-3 h-auto">
            <span class="text-xs font-mono">{tag}</span>
            <button
                class="btn btn-ghost btn-xs btn-circle hover:bg-primary-focus p-0 min-h-0 h-4 w-4"
                onclick={() => removeTag(tag)}
            >
                <X size={12} />
            </button>
        </div>
    {:else}
        <span class="text-xs opacity-40 italic">No flags required.</span>
    {/each}
</div>
