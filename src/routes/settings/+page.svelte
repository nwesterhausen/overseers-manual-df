<script lang="ts">
    import { settingsState } from "state/settings.svelte";
    import type { RawModuleLocation } from "bindings/DFRawParser";

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

    let currentTab = $state(1);
</script>

<div class="p-4">
    <div class="">
        <h3 class="font-bold text-xl">Settings</h3>
        <a href="/" class="btn btn-secondary btn-xs">&lt; back</a>
    </div>
    <div class="tabs tabs-border">
        <input
            type="radio"
            name="search_settings"
            class="tab"
            aria-label="Search"
            checked={currentTab === 1}
            onclick={() => (currentTab = 1)}
        />
        <div class="tab-content border-base-300 bg-base-100 p-10 grow">
            Set default search settings.
        </div>

        <input
            type="radio"
            name="parsing_settings"
            class="tab"
            aria-label="Parse"
            checked={currentTab === 2}
            onclick={() => (currentTab = 2)}
        />
        <div class="tab-content border-base-300 bg-base-100 p-10 grow">
            <h4 class="font-bold text-lg">Parsing Options</h4>
            <fieldset class="fieldset">
                <p>
                    If you're using the Steam version of Dwarf Fortress, its
                    location will be autodetected. If that fails or if you are
                    using Itch or have it installed somewhere else, set custom
                    locations for where Dwarf Fortress and your data are
                    located.
                </p>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text font-semibold"
                            >Dwarf Fortress Directory</span
                        >
                    </div>
                    <input
                        type="text"
                        placeholder="Auto-detected from Steam"
                        class="input input-bordered w-full"
                        bind:value={settingsState.df_dir}
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text font-semibold"
                            >Dwarf Fortress User Data Directory</span
                        >
                    </div>
                    <input
                        type="text"
                        placeholder="Auto-detected (in %AppData% or $HOME)"
                        class="input input-bordered w-full"
                        bind:value={settingsState.df_dir}
                    />
                </label>
            </fieldset>
            <fieldset class="fieldset">
                <legend class="bold">Locations</legend>
                <p>
                    Choose what locations to include when parsing the raws.
                    Choosing none results in no raws parsed.
                </p>
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
                            &nbsp;-&nbsp;Mods that have been used in at least
                            one world
                        {/if}
                    </label>
                {/each}
            </fieldset>
        </div>

        <input
            type="radio"
            name="advanced_settings"
            class="tab"
            aria-label="Advanced"
            checked={currentTab === 3}
            onclick={() => (currentTab = 3)}
        />
        <div class="tab-content border-base-300 bg-base-100 p-10">
            <fieldset class="fieldset rounded-box border p-2 pt-0">
                <legend class="fieldset-legend">Database</legend>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text font-semibold"
                            >Database Location</span
                        >
                    </div>
                    <input
                        type="text"
                        placeholder="./database.db"
                        class="input input-bordered w-full"
                        bind:value={settingsState.database_location}
                    />
                </label>
            </fieldset>
        </div>
    </div>
</div>
