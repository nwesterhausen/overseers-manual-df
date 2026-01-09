<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="p-4">
    <button onclick={() => history.back()} class="btn btn-sm">&lt; back</button>
    {#if data.details}
        <article>
            <section class="mt-8">
                {@html data.code}
            </section>
        </article>
    {:else}
        <div class="alert alert-error">
            <span>{data.error || "Something went wrong."}</span>
        </div>
    {/if}
</div>
