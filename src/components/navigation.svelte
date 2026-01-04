<script lang="ts">
    import { BookOpenText, Settings, SlidersHorizontal } from "@lucide/svelte";

    // Define props:
    // searchQuery: current text
    // onSearch: a callback function to tell the parent the text changed
    let { searchQuery = $bindable(), onSettingsClick } = $props<{
        searchQuery: string;
        onSettingsClick: () => void;
    }>();
</script>

<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
        <a href="/" class="btn btn-ghost text-sm">
            <BookOpenText /> Overseer's Reference
        </a>
    </div>

    <div class="navbar-center gap-2">
        <input
            type="search"
            class="input input-sm input-bordered"
            placeholder="Search raw files..."
            bind:value={searchQuery}
        />
        <button class="btn btn-ghost px-1">
            <SlidersHorizontal class="h-5 w-5" />
        </button>
    </div>

    <div class="navbar-end">
        <button class="btn btn-ghost px-1" onclick={onSettingsClick}>
            <Settings class="h-5 w-5" />
        </button>
    </div>
</div>
