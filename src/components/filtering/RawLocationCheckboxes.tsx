import type { Component } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";

const RawLocationCheckboxes: Component = () => {
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
						checked={locationIncluded("Vanilla")}
						onClick={() => toggleLocation("Vanilla")}
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
						checked={locationIncluded("InstalledMods")}
						onClick={() => toggleLocation("InstalledMods")}
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
						checked={locationIncluded("Mods")}
						onClick={() => toggleLocation("Mods")}
					/>
				</label>
			</div>
		</>
	);
};

export default RawLocationCheckboxes;
