import type { Component } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";

const RawLocationCheckboxes: Component<{ parsingOnly?: boolean }> = (props) => {
	const [_settings, { locationIncluded, toggleLocation }] = useSettingsContext();
	return (
		<>
			<div class="form-control">
				<label class="cursor-pointer label hover:font-semibold">
					<span class="label-text">Vanilla Raws</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						name="settingsEnableVanilla"
						checked={locationIncluded("Vanilla", props.parsingOnly)}
						onClick={() => toggleLocation("Vanilla", props.parsingOnly)}
					/>
				</label>
			</div>
			<div class="form-control">
				<label class="cursor-pointer label hover:font-semibold">
					<span class="label-text">Installed Mod Raws</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						name="settingsEnableInstalled"
						checked={locationIncluded("InstalledMods", props.parsingOnly)}
						onClick={() => toggleLocation("InstalledMods", props.parsingOnly)}
					/>
				</label>
			</div>
			<div class="form-control">
				<label class="cursor-pointer label hover:font-semibold">
					<span class="label-text">Downloaded Mod Raws</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						name="settingsEnableWorkshop"
						checked={locationIncluded("Mods", props.parsingOnly)}
						onClick={() => toggleLocation("Mods", props.parsingOnly)}
					/>
				</label>
			</div>
		</>
	);
};

export default RawLocationCheckboxes;
