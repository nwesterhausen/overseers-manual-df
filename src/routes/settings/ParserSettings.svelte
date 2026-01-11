<script lang="ts">
    import type { RawModuleLocation } from "bindings/DFRawParser";
    import { settingsState } from "state/settings.svelte";

    function toggleLocation(location: RawModuleLocation) {
        if (settingsState.parse_locations.includes(location)) {
            // Remove it if it's already there
            settingsState.parse_locations =
                settingsState.parse_locations.filter((l) => l !== location);
        } else {
            // Add it if it's not
            settingsState.parse_locations.push(location);
        }
    }
</script>

<div class="tab-container">
    <p class="py-4 text-sm">
        Configure what raw files should be parsed and from where. Overseer's
        Reference Manual keeps a cache of the parsed raw files in a database to
        provide faster lookups and to avoid having to rescan all raw files each
        time its opened.
    </p>
    <p class="text-warning">todo: make this formatted like search options</p>
    <div>
        <span class="text-xs section-heading">Startup Action</span>
        <div>
            <strong>radio options:</strong>
            <ul>
                <li>do nothing</li>
                <li>parse and insert</li>
                <li>parse and force update</li>
                <li>reset then parse</li>
            </ul>
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Manual Actions</span>
        <div class="flex flex-row gap-4 mx-auto">
            <button class="btn btn-primary btn-sm">Parse and Insert New</button>
            <button class="btn btn-warning btn-sm"
                >Parse and Force Update</button
            >
            <button class="btn btn-error btn-sm"
                >Reset Database, Parse and Insert</button
            >
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Directory Detection</span>
    </div>
    <div>
        <span class="text-xs section-heading">Directory Overrides</span>
    </div>
    <div>
        <span class="text-xs section-heading">Locations to Parse</span>
        <div class="custom-checkbox-container">
            {#each ["Vanilla", "InstalledMods", "Mods"] as location}
                <label class="custom-checkbox-label">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-primary checkbox-sm"
                        checked={settingsState.parse_locations.includes(
                            location as RawModuleLocation,
                        )}
                        onchange={() =>
                            toggleLocation(location as RawModuleLocation)}
                    />
                    {location}
                </label>
                <span class="text-xs text-accent relative -left-20 -bottom-7">
                    {#if location == "Mods"}
                        Downloaded mods from Steam Workshop
                    {:else if location == "InstalledMods"}
                        Mods that have been used in at least one world
                    {/if}
                </span>
            {/each}
        </div>
    </div>
</div>
