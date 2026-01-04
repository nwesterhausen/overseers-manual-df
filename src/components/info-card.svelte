<script lang="ts">
    interface Props {
        title: String;
        description: String;
    }

    let { title, description }: Props = $props();
</script>

<div class="card card-compact w-72 bg-neutral/25">
    <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <p>{description}</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary btn-xs">Show Details</button>
        </div>
    </div>
</div>
