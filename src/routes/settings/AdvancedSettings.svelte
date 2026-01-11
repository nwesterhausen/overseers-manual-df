<script lang="ts">
    import { settingsState } from "state/settings.svelte";
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
</div>
