<script lang="ts">
    import { toTitleCase } from "helpers";

    interface Props {
        title: string;
        module: string;
    }

    let { title, module } = $props();
</script>

<div class="flex-1">
    <h2 class="info-card-title">
        {toTitleCase(title, true)}
    </h2>
    <p class="info-card-module-title">
        {module}
    </p>
</div>
