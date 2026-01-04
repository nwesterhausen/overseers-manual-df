<script lang="ts">
    import {
        BookOpenText,
        SearchIcon,
        Settings,
        SlidersHorizontal,
    } from "@lucide/svelte";
    import SettingsBtn from "./SettingsBtn.svelte";

    let { searchQuery = $bindable(), onToggleAdvanced } = $props<{
        searchQuery: string | null;
        onToggleAdvanced: () => void;
    }>();
</script>

<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
        <a href="/" class="btn btn-ghost text-sm">
            <BookOpenText /> Overseer's Reference
        </a>
    </div>

    <div class="navbar-center gap-2">
        <label class="input input-md input-bordered">
            <SearchIcon class="h-5 w-5" />
            <input
                type="search"
                placeholder="Search raw files..."
                bind:value={searchQuery}
            />
        </label>
        <button
            class="btn btn-ghost px-1"
            onclick={onToggleAdvanced}
            title="Advanced Search"
        >
            <SlidersHorizontal class="h-5 w-5" />
        </button>
    </div>

    <div class="navbar-end">
        <SettingsBtn />
    </div>
</div>
