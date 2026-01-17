<script lang="ts">
    import type { RawObject } from "bindings/DFRawParser";
    import { toTitleCase } from "helpers";

    interface Props {
        raw: RawObject;
    }

    let { raw }: Props = $props();
</script>

<h1 class="text-3xl">
    {toTitleCase(raw.identifier.replace(/_/g, " "))}
</h1>
<div class="badge badge-primary">
    {raw.metadata.objectType}
</div>
