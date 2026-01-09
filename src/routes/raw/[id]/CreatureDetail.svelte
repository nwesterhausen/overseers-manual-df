<script lang="ts">
    import type { Creature } from "bindings/DFRawParser";

    interface Props {
        raw: Creature;
    }

    let { raw }: Props = $props();
</script>
