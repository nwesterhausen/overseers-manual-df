<script lang="ts">
    import { settingsState } from "state/settings.svelte";
</script>

<fieldset class="fieldset rounded-box border p-2 pt-0">
    <legend class="fieldset-legend">Database</legend>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text font-semibold">Database Location</span>
        </div>
        <input
            type="text"
            placeholder="./database.db"
            class="input input-bordered w-full"
            bind:value={settingsState.database_location}
        />
    </label>
</fieldset>
