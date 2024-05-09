import { type Component, For } from "solid-js";
import { labelForModule } from "../../lib/Raw";
import { useRawsProvider } from "../../providers/RawsProvider";
import { useSearchProvider } from "../../providers/SearchProvider";

const RawModuleFilter: Component = () => {
	const searchContext = useSearchProvider();
	const rawsContext = useRawsProvider();

	return (
		<div>
			<div class="flex flex-row">
				<div class="me-2 font-bold flex-1 align-middle">Enabled Raw Modules</div>
				<div class="m-2 join">
					<button
						class="btn join-item btn-xs btn-secondary"
						onClick={() => searchContext.addFilteredModule(rawsContext.rawModulesInfo.latest.map((m) => m.identifier))}
					>
						Uncheck All
					</button>
					<button class="btn join-item btn-xs btn-error" onClick={searchContext.removeAllFilteredModules}>
						Reset
					</button>
				</div>
			</div>
			<For each={rawsContext.rawModulesInfo.latest}>
				{(module) => (
					<div>
						<label class="label cursor-pointer">
							<span class="label-text">{labelForModule(module)}</span>
							<input
								type="checkbox"
								id={`${module.objectId}-enabled`}
								checked={searchContext.filteredModules().indexOf(module.objectId) === -1}
								onChange={(event) => {
									const el = event.target as HTMLInputElement;
									if (el.checked) {
										searchContext.removeFilteredModule(module.objectId);
									} else {
										searchContext.addFilteredModule(module.objectId);
									}
								}}
							/>
						</label>
					</div>
				)}
			</For>
		</div>
	);
};

export default RawModuleFilter;
