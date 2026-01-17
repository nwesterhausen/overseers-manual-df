<script lang="ts">
    import {
        BookOpenText,
        History,
        MoonIcon,
        RefreshCcw,
        SearchIcon,
        SettingsIcon,
        SlidersHorizontal,
        SunIcon,
    } from "@lucide/svelte";
    import ThemeToggler from "./ThemeToggler.svelte";
    import { searchState } from "state/search.svelte";
    import { executeParse } from "wrappers";

    let { onToggleAdvanced, advancedIsOpen = $bindable() } = $props<{
        onToggleAdvanced: () => void;
        advancedIsOpen: boolean | null;
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
                bind:value={searchState.searchString}
            />
        </label>
        <div class="tooltip tooltip-bottom" data-tip="Search Filters">
            <button
                class:btn-active={advancedIsOpen}
                class="btn btn-ghost px-1"
                onclick={onToggleAdvanced}
                title="Advanced Search"
            >
                <SlidersHorizontal class="h-5 w-5" />
            </button>
        </div>
    </div>

    <div class="navbar-end">
        <div class="tooltip tooltip-left" data-tip="Parse & Insert">
            <button
                class="btn btn-ghost px-1"
                title="Parse and Insert"
                onclick={() => executeParse("insertOnly")}
            >
                <RefreshCcw class="h-5 w-5" />
            </button>
        </div>
        <div class="tooltip tooltip-left" data-tip="History">
            <a class="btn btn-ghost px-1" title="History" href="/history">
                <History class="h-5 w-5" />
            </a>
        </div>
        <div class="tooltip tooltip-left" data-tip="Toggle Theme dark/light">
            <ThemeToggler />
        </div>
        <div class="tooltip tooltip-left" data-tip="Settings">
            <a class="btn btn-ghost px-1" href="/settings">
                <SettingsIcon class="h-5 w-5" />
            </a>
        </div>
    </div>
</div>
