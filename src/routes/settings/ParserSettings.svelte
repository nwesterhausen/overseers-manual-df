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

<div class="flex flex-wrap gap-4 flex-col w-9/12">
    <p class="py-4 text-sm">
        Configure what raw files should be parsed and from where. Overseer's
        Reference Manual keeps a cache of the parsed raw files in a database to
        provide faster lookups and to avoid having to rescan all raw files each
        time its opened.
    </p>
    <p class="text-warning">todo: make this formatted like search options</p>
    <div>
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Startup Action</span
        >
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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Manual Actions</span
        >
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
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Directory Detection</span
        >
    </div>
    <div>
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Directory Overrides</span
        >
    </div>
    <div>
        <span class="text-xs font-bold uppercase opacity-60 block mb-2"
            >Locations to Parse</span
        >
        <div class="flex flex-wrap gap-4 w-full mx-5">
            {#each ["Vanilla", "InstalledMods", "Mods"] as location}
                <label class="label">
                    <input
                        type="checkbox"
                        class="toggle toggle-sm toggle-primary"
                        checked={settingsState.parse_locations.includes(
                            location as RawModuleLocation,
                        )}
                        onchange={() =>
                            toggleLocation(location as RawModuleLocation)}
                    />
                    {location}{#if location == "Mods"}
                        &nbsp;-&nbsp;Downloaded mods from Steam Workshop
                    {:else if location == "InstalledMods"}
                        &nbsp;-&nbsp;Mods that have been used in at least one
                        world
                    {/if}
                </label>
            {/each}
        </div>
    </div>
</div>
