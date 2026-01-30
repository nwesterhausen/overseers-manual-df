<script lang="ts">
    interface Props {
        objectType: string;
        objectId: string;
    }

    let { objectType, objectId } = $props();
</script>

<span class="text-xs font-mono absolute left-1.25 bottom-1">{objectType}</span>
<span
    style="font-size:0.5rem"
    class="text-primary/75 font-mono absolute right-1.25 bottom-1"
    >{objectId}</span
>
