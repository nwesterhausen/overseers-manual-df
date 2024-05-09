import { type Component, For, Show } from "solid-js";
import { STS_IDLE } from "../lib/Constants";
import { useRawsProvider } from "../providers/RawsProvider";
import DynamicCard from "./DynamicCard";

const Listings: Component = () => {
	const rawsContext = useRawsProvider();

	return (
		<Show
			when={rawsContext.parsingStatus() === STS_IDLE && rawsContext.parsedRaws.latest.results.length > 0}
			fallback={
				<Show when={rawsContext.parsingStatus() === STS_IDLE}>
					<div class="my-5 text-center text-neutral-700">No results</div>
				</Show>
			}
		>
			<div class="flex flex-wrap justify-center gap-4 mb-16">
				<For each={rawsContext.parsedRaws.latest.results}>{(raw) => <DynamicCard raw={raw} />}</For>
			</div>
		</Show>
	);
};

export default Listings;
