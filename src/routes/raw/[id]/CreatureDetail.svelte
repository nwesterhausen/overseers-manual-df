<script lang="ts">
    import type { Caste, Creature } from "bindings/DFRawParser";
    import SpriteDisplay from "../SpriteDisplay.svelte";

    interface Props {
        raw: Creature;
    }

    let { raw }: Props = $props();

    // Helper to extract simple string tags from the complex CasteTag union
    function getSimpleTags(caste: Caste): string[] {
        if (!caste.tags) return [];
        return caste.tags.filter((t) => typeof t === "string") as string[];
    }

    let activeCaste = $derived.by(() =>
        raw.castes.find((c) => c.identifier === "ALL"),
    );
</script>

<div class="flex flex-col gap-6 p-4 max-w-6xl mx-auto">
    <header
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-base-300 pb-4"
    >
        <div>
            <h1 class="text-4xl font-bold capitalize">{raw.name.singular}</h1>
            <p class="text-base-content/60 italic">
                {raw.name.plural} | {raw.identifier}
            </p>
        </div>

        <div class="stats shadow bg-base-200">
            <div class="stat">
                <div class="stat-title text-xs uppercase font-bold">
                    Frequency
                </div>
                <div class="stat-value text-secondary text-2xl">
                    {raw.frequency ?? 50}
                </div>
            </div>
            <div class="stat">
                <div class="stat-title text-xs uppercase font-bold">
                    Cluster Size
                </div>
                <div class="stat-value text-primary text-2xl">
                    {raw.clusterNumber
                        ? `${raw.clusterNumber[0]}-${raw.clusterNumber[1]}`
                        : "1"}
                </div>
            </div>
        </div>
    </header>

    <section class="flex flex-wrap gap-2">
        {#each raw.biomes ?? [] as biome}
            <div class="badge badge-outline badge-info">{biome}</div>
        {/each}
        {#each raw.prefStrings ?? [] as pref}
            <div class="badge badge-outline badge-ghost italic">
                "Liked for their {pref}"
            </div>
        {/each}
    </section>
    <SpriteDisplay identifier={raw.identifier} />
    {#if activeCaste}
        <div
            class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
        >
            <div class="lg:col-span-2 space-y-6">
                <div class="card bg-base-100 border border-base-300 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-primary uppercase text-sm">
                            Description
                        </h2>
                        <p class="text-lg leading-relaxed">
                            {activeCaste.description ??
                                "No specific description provided for this caste."}
                        </p>

                        <div class="divider">Physical Details</div>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="flex flex-col">
                                <span
                                    class="text-xs opacity-50 uppercase font-bold"
                                    >Max Age</span
                                >
                                <span class="font-mono"
                                    >{activeCaste.maxAge
                                        ? `${activeCaste.maxAge[0]}-${activeCaste.maxAge[1]}`
                                        : "Immortal"}</span
                                >
                            </div>
                            <div class="flex flex-col">
                                <span
                                    class="text-xs opacity-50 uppercase font-bold"
                                    >Baby Age</span
                                >
                                <span class="font-mono"
                                    >{activeCaste.baby ?? 0}</span
                                >
                            </div>
                            <div class="flex flex-col">
                                <span
                                    class="text-xs opacity-50 uppercase font-bold"
                                    >Adult Age</span
                                >
                                <span class="font-mono"
                                    >{activeCaste.child ?? 0}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200 shadow-inner">
                    <div class="card-body">
                        <h2 class="card-title text-sm uppercase">
                            Abilities & Traits
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            {#each getSimpleTags(activeCaste) as tag}
                                <span class="badge badge-sm badge-neutral py-3"
                                    >{tag}</span
                                >
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="card bg-base-100 border border-base-300 shadow-sm">
                    <div class="card-body p-0 overflow-hidden">
                        <div
                            class="bg-base-300 p-4 font-bold text-xs uppercase tracking-widest"
                        >
                            Growth Stages
                        </div>
                        <table class="table table-xs w-full">
                            <thead>
                                <tr>
                                    <th>Age (Y:D)</th>
                                    <th>Size (cm³)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each activeCaste.bodySize ?? [] as size}
                                    <tr>
                                        <td class="font-mono"
                                            >{size.years}y {size.days}d</td
                                        >
                                        <td class="font-mono text-secondary"
                                            >{size.sizeCm3.toLocaleString()}</td
                                        >
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card bg-primary text-primary-content">
                    <div class="card-body">
                        <h3 class="font-bold uppercase text-xs">Pet Value</h3>
                        <div class="text-3xl font-black">
                            {activeCaste.petValue ?? 0}
                        </div>
                        <div class="divider divider-accent opacity-20"></div>
                        <div class="flex justify-between">
                            <span>Grazer</span>
                            <span class="font-mono"
                                >{activeCaste.grazer ?? "N/A"}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
