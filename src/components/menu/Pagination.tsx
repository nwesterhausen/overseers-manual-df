import { For, JSX, Show, createMemo } from "solid-js";
import { useRawsProvider } from "../../providers/RawsProvider";
import { useSettingsContext } from "../../providers/SettingsProvider";

function Pagination(): JSX.Element {
	const rawsContext = useRawsProvider();
	const [settings, { gotoPage, nextPage, prevPage }] = useSettingsContext();

	const pageNumbers = createMemo(() => {
		if (rawsContext.parsedRaws.latest.totalPages === 1) {
			return [];
		}
		const pageArray: number[] = [];
		let firstNumber = 1;
		if (rawsContext.parsedRaws.latest.totalPages > 10 && settings.currentPage > 6) {
			firstNumber = settings.currentPage - 4;
		}
		for (let i = firstNumber; i <= 8 + firstNumber && i <= rawsContext.parsedRaws.latest.totalPages; i++) {
			pageArray.push(i);
		}
		return pageArray;
	});
	const showFirstPageAndEllipses = createMemo(() => {
		return rawsContext.parsedRaws.latest.totalPages > 10 && settings.currentPage > 6;
	});
	const showLastPageAndEllipses = createMemo(() => {
		return (
			pageNumbers().length > 0 && pageNumbers()[pageNumbers().length - 1] !== rawsContext.parsedRaws.latest.totalPages
		);
	});
	return (
		<Show when={rawsContext.parsedRaws.latest.totalPages > 1}>
			<div class="fixed bottom-0 w-full">
				<div class="flex justify-center my-2">
					<div class="join">
						<button
							class="join-item btn btn-xs"
							classList={{ disabled: settings.currentPage === 0 }}
							onClick={() => prevPage()}
						>
							«
						</button>
						<Show when={showFirstPageAndEllipses()}>
							<button
								class="join-item btn btn-xs"
								classList={{ "btn-primary": settings.currentPage === 0 }}
								onClick={() => gotoPage(1)}
							>
								1
							</button>
							<Show when={settings.currentPage > 6}>
								<button class="join-item btn btn-xs btn-disabled">...</button>
							</Show>
						</Show>
						<For each={pageNumbers()}>
							{(i) => (
								<button
									class="join-item btn btn-xs"
									classList={{ "btn-primary": settings.currentPage === i }}
									onClick={() => gotoPage(i)}
								>
									{i}
								</button>
							)}
						</For>
						<Show when={showLastPageAndEllipses()}>
							<Show when={pageNumbers()[pageNumbers().length - 1] + 1 < rawsContext.parsedRaws.latest.totalPages}>
								<button class="join-item btn btn-xs btn-disabled">...</button>
							</Show>
							<button
								class="join-item btn btn-xs"
								classList={{ disabled: settings.currentPage === rawsContext.parsedRaws.latest.totalPages }}
								onClick={() => gotoPage(rawsContext.parsedRaws.latest.totalPages)}
							>
								{rawsContext.parsedRaws.latest.totalPages}
							</button>
						</Show>
						<button
							class="join-item btn btn-xs"
							classList={{ disabled: settings.currentPage === rawsContext.parsedRaws.latest.totalPages }}
							onClick={() => nextPage()}
						>
							»
						</button>
					</div>
				</div>
			</div>
		</Show>
	);
}

export default Pagination;
