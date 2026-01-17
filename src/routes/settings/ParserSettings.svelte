<script lang="ts">
    import { locationOptions, startupOptions } from "searchOptions";
    import {
        settingsState,
        toggleDirectoryDetection,
        toggleLocation,
    } from "state/settings.svelte";
    import { executeParse } from "wrappers";
</script>

<div class="tab-container">
    <p class="py-4 text-sm">
        Configure what raw files should be parsed and from where. Overseer's
        Reference Manual keeps a cache of the parsed raw files in a database to
        provide faster lookups and to avoid having to rescan all raw files each
        time its opened.
    </p>
    <div>
        <span class="text-xs section-heading">Locations to Parse</span>
        <div class="custom-checkbox-container">
            {#each locationOptions as location}
                <div class="flex flex-col gap-1">
                    <label class="custom-checkbox-label">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-primary checkbox-sm"
                            checked={settingsState.parseLocations.includes(
                                location.value,
                            )}
                            onchange={() => toggleLocation(location.value)}
                        />
                        {location.label}
                    </label>
                    <span class="custom-checkbox-detail-label text-accent">
                        {#if location.value == "WorkshopMods"}
                            Downloaded mods from Steam Workshop
                        {:else if location.value == "InstalledMods"}
                            Mods that have been used in at least one world
                        {/if}
                    </span>
                </div>
            {/each}
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Manual Actions</span>
        <div class="flex flex-row gap-4 mx-5">
            <button
                disabled={settingsState.appState !== "ready"}
                class="btn btn-primary btn-sm"
                onclick={() => executeParse("insertOnly")}
                >Parse and Insert New</button
            >
            <button
                disabled={settingsState.appState !== "ready"}
                class="btn btn-warning btn-sm"
                onclick={() => executeParse("forceUpdate")}
                >Parse and Force Update</button
            >
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Startup Action</span>
        <div class="flex flex-row pt-3 gap-5">
            {#each startupOptions as option}
                <label class="label cursor-pointer justify-start gap-2 p-0">
                    <input
                        type="radio"
                        name="startupAction"
                        class="radio radio-sm radio-primary"
                        value={option.value}
                        bind:group={settingsState.startupAction}
                    />
                    <span class="label-text text-base">{option.label}</span>
                </label>
            {/each}
        </div>
    </div>
    <div>
        <span class="text-xs section-heading">Directory Detection</span>
        <p class="pb-4 text-sm">
            This attempts to automatically finds the installation directory
            through steam's app manifest files and user data directory by
            assuming the well-known path for it.
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
        <dl class="py-4 text-sm">
            <dt>Windows</dt>
            <dd>Locates the Steam directory by using the registry.</dd>
            <dd>
                Locates the User Directory by assuming <code
                    >%APPDATA%&bsol;Bay 12 Games&bsol;Dwarf Fortress</code
                >
            </dd>
            <dt>Linux</dt>
            <dd>
                Locates the Steam directory in <code>$HOME</code>, tries
                standard and flatpak paths
            </dd>
            <dd>
                Locates the User Directory by assuming <code
                    >$HOME/.local/share/Bay 12 Games/Dwarf Fortress</code
                >
            </dd>
        </dl>
    </div>
    <div>
        <span class="text-xs section-heading">Directory Overrides</span>
        <p class="pb-4 text-sm">
            If either one of these is set, its path is preferred over anything
            auto-detected.
        </p>
        <div class="custom-text-input-container">
            <div>
                <legend class="custom-legend">Dwarf Fortress Directory</legend>
                <label class="input">
                    Path
                    <input
                        type="text"
                        class="grow"
                        placeholder="src/app/"
                        bind:value={settingsState.dfDirectory}
                    />
                    <span class="badge badge-neutral badge-xs">Optional</span>
                </label>
            </div>
            <div>
                <legend class="custom-legend">User Data Directory</legend>
                <label class="input">
                    Path
                    <input
                        type="text"
                        class="grow"
                        placeholder="src/app/"
                        bind:value={settingsState.userDirectory}
                    />
                    <span class="badge badge-neutral badge-xs">Optional</span>
                </label>
            </div>
        </div>
    </div>
</div>
