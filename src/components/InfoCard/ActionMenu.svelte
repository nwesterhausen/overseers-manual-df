<script lang="ts">
    import { ChevronDown } from "@lucide/svelte";
    import { searchState } from "state/search.svelte";
    import { settingsState } from "state/settings.svelte";

    interface Props {
        rawId: string;
        moduleId: string;
    }

    let { rawId, moduleId }: Props = $props();
</script>

<a class="btn btn-primary btn-xs join-item" href="/raw/{rawId}">More Detail</a>
<div class="dropdown dropdown-top dropdown-end">
    <details>
        <summary
            class="btn btn-primary btn-xs join-item border-l-primary-focus list-none"
        >
            <ChevronDown class="w-4 h-4" />
        </summary>
        <ul
            class="dropdown-content z-1 menu p-1 shadow bg-base-100 rounded-box w-40 text-xs"
        >
            <li>
                <button type="button">Open Raw File</button>
            </li>
            <li>
                <button
                    type="button"
                    onclick={() => searchState.query.inModules.push(moduleId)}
                    >Search Module</button
                >
            </li>
            <li><button type="button">Find Similar</button></li>
            <div class="divider my-0"></div>
            <li>
                <a type="button" href="/json/{rawId}">View Raw (JSON)</a>
            </li>
            <li>
                <a type="button" href="/parsed/{rawId}">View Raw (Parsed)</a>
            </li>
        </ul>
    </details>
</div>
