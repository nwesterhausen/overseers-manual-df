<script lang="ts">
    import { settingsState } from "state/settings.svelte";
    import { executeParse } from "wrappers";
</script>

<div class="tab-container">
    <div>
        <span class="text-xs section-heading">Database Location</span>
        <label class="form-control w-full">
            <input
                type="text"
                placeholder="./database.db"
                class="input input-bordered w-full"
                bind:value={settingsState.databaseLocation}
            />
        </label>
    </div>
    <button
        disabled={settingsState.appState !== "ready"}
        class="btn btn-error btn-sm"
        onclick={() => executeParse("reset")}
        >Reset Database, Parse and Insert</button
    >
</div>
