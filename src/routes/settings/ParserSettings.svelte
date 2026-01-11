<script lang="ts">
    import type { RawModuleLocation } from "bindings/DFRawParser";
    import {
        settingsState,
        toggleDirectoryDetection,
        toggleLocation,
    } from "state/settings.svelte";
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
        <p class="pb-4 text-sm">
            On Windows, uses the registry to find Steam and then Steam to find
            where Dwarf Fortress is installed. On Linux, it looks into the Steam
            directory in <code>$HOME</code>
        </p>
        <div class="custom-checkbox-container">
            <label class="custom-checkbox-label">
                <input
                    type="checkbox"
                    class="checkbox checkbox-primary checkbox-sm"
                    checked={settingsState.enableDirectoryDetection}
                    onchange={toggleDirectoryDetection}
                />
                Enable automatic Dwarf Fortress installation detection
            </label>
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Directory Overrides</span>
    </div>
    <div>
        <span class="text-xs section-heading">Locations to Parse</span>
        <div class="custom-checkbox-container">
            {#each ["Vanilla", "InstalledMods", "Mods"] as location}
                <div class="flex flex-col gap-1">
                    <label class="custom-checkbox-label">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-primary checkbox-sm"
                            checked={settingsState.parseLocations.includes(
                                location as RawModuleLocation,
                            )}
                            onchange={() =>
                                toggleLocation(location as RawModuleLocation)}
                        />
                        {location}
                    </label>
                    <span class="custom-checkbox-detail-label text-accent">
                        {#if location == "Mods"}
                            Downloaded mods from Steam Workshop
                        {:else if location == "InstalledMods"}
                            Mods that have been used in at least one world
                        {/if}
                    </span>
                </div>
            {/each}
        </div>
    </div>
</div>
