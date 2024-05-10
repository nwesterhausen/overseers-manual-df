import { For, type JSX, Show, createMemo } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";
import { useSearchProvider } from "../../providers/SearchProvider";

function Pagination(): JSX.Element {
	const [settings, { gotoPage, nextPage, prevPage }] = useSettingsContext();
	const searchContext = useSearchProvider();

	const pageNumbers = createMemo(() => {
		if (searchContext.searchResults.latest.totalPages === 1) {
			return [];
		}
		const pageArray: number[] = [];
		let firstNumber = 1;
		if (searchContext.searchResults.latest.totalPages > 10 && settings.currentPage > 6) {
			firstNumber = settings.currentPage - 4;
		}
		for (let i = firstNumber; i <= 8 + firstNumber && i <= searchContext.searchResults.latest.totalPages; i++) {
			pageArray.push(i);
		}
		return pageArray;
	});
	const showFirstPageAndEllipses = createMemo(() => {
		return searchContext.searchResults.latest.totalPages > 10 && settings.currentPage > 6;
	});
	const showLastPageAndEllipses = createMemo(() => {
		return (
			pageNumbers().length > 0 &&
			pageNumbers()[pageNumbers().length - 1] !== searchContext.searchResults.latest.totalPages
		);
	});
	return (
		<Show when={searchContext.searchResults.latest.totalPages > 1}>
			<div class="fixed bottom-0 w-full">
				<div class="flex justify-center my-2">
					<div class="join">
						<button
							type="button"
							class="join-item btn btn-xs"
							classList={{ disabled: settings.currentPage === 0 }}
							onClick={() => prevPage()}
						>
							«
						</button>
						<Show when={showFirstPageAndEllipses()}>
							<button
								type="button"
								class="join-item btn btn-xs"
								classList={{ "btn-primary": settings.currentPage === 0 }}
								onClick={() => gotoPage(1)}
							>
								1
							</button>
							<Show when={settings.currentPage > 6}>
								<button type="button" class="join-item btn btn-xs btn-disabled">
									...
								</button>
							</Show>
						</Show>
						<For each={pageNumbers()}>
							{(i) => (
								<button
									type="button"
									class="join-item btn btn-xs"
									classList={{ "btn-primary": settings.currentPage === i }}
									onClick={() => gotoPage(i)}
								>
									{i}
								</button>
							)}
						</For>
						<Show when={showLastPageAndEllipses()}>
							<Show when={pageNumbers()[pageNumbers().length - 1] + 1 < searchContext.searchResults.latest.totalPages}>
								<button type="button" class="join-item btn btn-xs btn-disabled">
									...
								</button>
							</Show>
							<button
								type="button"
								class="join-item btn btn-xs"
								classList={{ disabled: settings.currentPage === searchContext.searchResults.latest.totalPages }}
								onClick={() => gotoPage(searchContext.searchResults.latest.totalPages)}
							>
								{searchContext.searchResults.latest.totalPages}
							</button>
						</Show>
						<button
							type="button"
							class="join-item btn btn-xs"
							classList={{ disabled: settings.currentPage === searchContext.searchResults.latest.totalPages }}
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
