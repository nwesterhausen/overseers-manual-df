import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { useRawsProvider } from "../../providers/RawsProvider";
import RawModuleInfoTable from "./RawModuleInfoTable";

const ParsedModInfo: Component = () => {
	const rawsContext = useRawsProvider();
	const [selected, setSelected] = createSignal("");

	createEffect(() => {
		if (rawsContext.rawModulesInfo.latest.length > 0) {
			setSelected(rawsContext.rawModulesInfo.latest[0].identifier);
		} else {
			setSelected("");
		}
	});

	return (
		<div>
			<section>
				<h2>Summary</h2>
				<ul>
					<li>Total read raw modules: {rawsContext.rawModulesInfo.latest.length}</li>
					<li>
						From installed_mods:{" "}
						{rawsContext.rawModulesInfo.latest.filter((v) => v.location === "InstalledMods").length}
					</li>
					<li>From mods: {rawsContext.rawModulesInfo.latest.filter((v) => v.location === "Mods").length}</li>
					<li>From mods: {rawsContext.rawModulesInfo.latest.filter((v) => v.location === "Vanilla").length}</li>
				</ul>
			</section>
			<section>
				<select
					onChange={(e) => {
						const el = e.target as HTMLSelectElement;
						setSelected(el.value);
					}}
				>
					<For each={rawsContext.rawModulesInfo.latest.sort((a, b) => (a.name < b.name ? -1 : 1))}>
						{(modInfo) => (
							<option value={modInfo.identifier} selected={selected() === modInfo.identifier}>
								{modInfo.name} v{modInfo.displayedVersion} (from {modInfo.displayedVersion})
							</option>
						)}
					</For>
				</select>
				<Show when={selected() !== ""}>
					<legend>Details</legend>
					<RawModuleInfoTable module={rawsContext.rawModulesInfo.latest.find((v) => v.identifier === selected())} />
				</Show>
			</section>
		</div>
	);
};

export default ParsedModInfo;
