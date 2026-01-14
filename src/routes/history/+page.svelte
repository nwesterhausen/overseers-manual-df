<script lang="ts">
    import { parserLogs } from "state/parserState.svelte";
    import "./page.css";
</script>

<div class="p-4">
    <h2 class="section-heading">Parsing Logs</h2>
    <ul>
        {#each parserLogs.history as message}
            <li>{message}</li>
        {/each}
    </ul>
    <h2 class="section-heading">Search History</h2>
</div>
