<script lang="ts">
    import { Settings as SettingsIcon } from "@lucide/svelte";
    import { settingsState } from "../settings.svelte";
    import type { RawModuleLocation } from "../bindings/DFRawParser";

    let modalRef: HTMLDialogElement;
    function closeOnBackdrop(e: MouseEvent) {
        if (e.target === modalRef) {
            modalRef.close();
        }
    }
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

<button class="btn btn-ghost px-1" onclick={() => modalRef.showModal()}>
    <SettingsIcon class="h-5 w-5" />
</button>

<dialog bind:this={modalRef} class="modal" onclick={closeOnBackdrop}>
    <div class="modal-box">
        <form method="dialog">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >✕</button
            >
        </form>
        <h3 class="font-bold text-lg">Settings</h3>
        <div class="py-4">
            <fieldset class="fieldset rounded-box p-2 pt-0 border">
                <legend class="fieldset-legend">Locations</legend>
                <p>
                    Set custom locations for where Dwarf Fortress and your data
                    are located.
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
            <fieldset class="fieldset rounded-box border p-2 pt-0">
                <legend class="fieldset-legend">Locations to Parse</legend>
                <p>
                    Choose what locations to include when parsing the raws.
                    Choosing none results in no raws parsed.
                </p>
                {#each ["Vanilla", "InstalledMods", "Mods"] as location}
                    <label class="label">
                        <input
                            type="checkbox"
                            class="toggle toggle-xs toggle-primary"
                            checked={settingsState.parse_locations.includes(
                                location as RawModuleLocation,
                            )}
                            onchange={() =>
                                toggleLocation(location as RawModuleLocation)}
                        />
                        {location}
                    </label>
                {/each}
            </fieldset>
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
</dialog>
