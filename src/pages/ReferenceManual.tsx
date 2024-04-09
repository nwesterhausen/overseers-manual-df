import { Show, createMemo } from "solid-js";
import type { JSX } from "solid-js";
import DFDirectoryNotSet from "../components/DFDirectoryNotSet";
import Listings from "../components/Listings";
import LoadingRawsProgress from "../components/LoadingRawsProgress";
import ParsingProgressBar from "../components/ParsingProgressBar";
import FilterButton from "../components/filtering/FilterButton";
import { STS_EMPTY, STS_IDLE } from "../lib/Constants";
import { useRawsProvider } from "../providers/RawsProvider";
import { useSettingsContext } from "../providers/SettingsProvider";

function ReferenceManual(): JSX.Element {
	const rawsContext = useRawsProvider();
	const [settings] = useSettingsContext();
	// Helper boolean to know when to display the page or not
	const contentToDisplay = createMemo(() => {
		return rawsContext.parsingStatus() === STS_IDLE && settings.parsing.directoryPath.length > 0;
	});
	return (
		<div class="px-2 main">
			<div class="flex justify-center">
				<ParsingProgressBar />
				<LoadingRawsProgress />
			</div>
			<Show when={contentToDisplay()}>
				<FilterButton />
				<Listings />
			</Show>
			<Show when={!contentToDisplay() && rawsContext.parsingStatus() === STS_EMPTY}>
				<DFDirectoryNotSet />
			</Show>
		</div>
	);
}

export default ReferenceManual;
