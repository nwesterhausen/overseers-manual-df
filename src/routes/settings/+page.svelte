<script lang="ts">
    import { settingsState } from "state/settings.svelte";
    import type { RawModuleLocation } from "bindings/DFRawParser";
    import SearchSettings from "./SearchSettings.svelte";
    import ParserSettings from "./ParserSettings.svelte";
    import AdvancedSettings from "./AdvancedSettings.svelte";

    let currentTab = $state(1);
</script>

<div class="p-4">
    <div class="">
        <h3 class="font-bold text-xl">Settings</h3>
        <button onclick={() => history.back()} class="btn btn-ghost btn-xs"
            >&lt; back</button
        >
    </div>
    <div class="tabs tabs-border">
        <input
            type="radio"
            name="search_settings"
            class="tab mb-2"
            aria-label="Search"
            checked={currentTab === 1}
            onclick={() => (currentTab = 1)}
        />
        <div class="tab-content">
            <SearchSettings />
        </div>

        <input
            type="radio"
            name="parsing_settings"
            class="tab"
            aria-label="Parse"
            checked={currentTab === 2}
            onclick={() => (currentTab = 2)}
        />
        <div class="tab-content">
            <ParserSettings />
        </div>

        <input
            type="radio"
            name="advanced_settings"
            class="tab"
            aria-label="Advanced"
            checked={currentTab === 3}
            onclick={() => (currentTab = 3)}
        />
        <div class="tab-content">
            <AdvancedSettings />
        </div>
    </div>
</div>
