import { Combobox } from "@kobalte/core";
import { BiRegularCaretDown, BiRegularCheck, BiRegularX } from "solid-icons/bi";
import { type Component, For, createEffect, createMemo, createSignal } from "solid-js";
import type { RawModuleLocation } from "../../../src-tauri/bindings/Bindings";
import type { ModuleItem } from "../../lib/Modules";
import { useRawsProvider } from "../../providers/RawsProvider";
import { useSettingsContext } from "../../providers/SettingsProvider";

const ModuleFiltering: Component = () => {
	const [settings, { updateFilteredModules }] = useSettingsContext();
	const rawsContext = useRawsProvider();
	const [values, setValues] = createSignal<ModuleItem[]>([]);
	createEffect(() => {
		updateFilteredModules(values().map((module) => module.objectId));
	});

	type Category = {
		location: RawModuleLocation;
		options: ModuleItem[];
	};
	const options = createMemo<Category[]>(() => {
		return settings.filtering.locations.map((location) => {
			return {
				location,
				options: rawsContext.rawModulesInfo.latest
					.filter((module) => module.location === location)
					.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()))
					.map((module) => {
						return {
							objectId: module.objectId,
							label: `${module.name} ${module.displayedVersion}`,
							disabled: false,
						};
					}),
			};
		});
	});

	return (
		<div class="bg-base-100">
			<Combobox.Root<ModuleItem, Category>
				multiple
				options={options()}
				optionValue="objectId"
				optionTextValue="label"
				optionLabel="label"
				optionDisabled="disabled"
				optionGroupChildren="options"
				value={values()}
				onChange={setValues}
				placeholder="Search module options"
				itemComponent={(props) => (
					<Combobox.Item class="join-item cursor-pointer flex justify-between items-center hover:underline pb-1" item={props.item}>
						<Combobox.ItemLabel>{props.item.rawValue.label}</Combobox.ItemLabel>
						<Combobox.ItemIndicator class="bg-success/75 rounded-full p-1 float-right">
							<BiRegularCheck />
						</Combobox.ItemIndicator>
					</Combobox.Item>
				)}
			>
				<Combobox.Portal>
					<Combobox.Content
						class="rounded-lg border-2 border-slate-400 bg-base-100  p-2 join join-vertical gap-1 text-sm"
						style={{
							position: "fixed",
							top: `${-16 - values().length * 1.075}rem`,
							left: "calc(100% + 2.5rem)",
							"max-height": "calc(80vh - 4rem)",
							"overflow-y": "scroll",
							width: "20rem",
						}}
					>
						<span class="join-item bg-base-100 border-b border-b-slate-500 font-medium text-center">Available Modules</span>
						<Combobox.Listbox />
					</Combobox.Content>
				</Combobox.Portal>
				<Combobox.Control<ModuleItem> aria-label="Modules">
					{(state) => (
						<>
							<div class="flex flex-col gap-2">
								<div class="join join-vertical gap-1">
									<For each={state.selectedOptions()}>
										{(option) => (
											<div class="join-item flex justify-between max-w-xs">
												<span class="text-xs cursor-default truncate" title={option.label} onPointerDown={(e) => e.stopPropagation()}>
													{option.label}
												</span>
												<button
													type="button"
													class="hover:text-error tooltip tooltip-left"
													data-tip="Remove"
													onClick={() => state.remove(option)}
												>
													<BiRegularX />
												</button>
											</div>
										)}
									</For>
								</div>
								<div class="form-control w-full">
									<Combobox.Input class="input input-xs input-bordered w-full max-w-xs" />
								</div>
								<div class="flex flex-row justify-between">
									<Combobox.Trigger class="self-center tooltip tooltip-right bg-info rounded hover:text-black/50" data-tip="Show All Options">
										<Combobox.Icon>
											<BiRegularCaretDown />
										</Combobox.Icon>
									</Combobox.Trigger>
									<button
										type="button"
										class="bg-error hover:text-black/50 rounded self-center tooltip tooltip-left"
										data-tip="Clear All"
										onPointerDown={(e) => e.stopPropagation()}
										onClick={state.clear}
									>
										<BiRegularX />
									</button>
								</div>
							</div>
						</>
					)}
				</Combobox.Control>
			</Combobox.Root>
		</div>
	);
};

export default ModuleFiltering;
