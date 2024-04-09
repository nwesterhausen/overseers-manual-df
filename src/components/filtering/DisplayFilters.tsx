import { Component } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";

const DisplayFilters: Component = () => {
	const [settings, { toggleDisplayGraphics, setResultsPerPage }] = useSettingsContext();
	return (
		<>
			{" "}
			<div class="form-control">
				<label class="cursor-pointer label hover:font-semibold">
					<span class="label-text">Display Graphics</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						name="settingsEnableGraphics"
						checked={settings.displayGraphics}
						onClick={toggleDisplayGraphics}
					/>
				</label>
			</div>
			{/* <div class='form-control'>
        <label class='cursor-pointer label hover:font-semibold'>
          <span class='label-text'>Layout as Grid</span>
          <input
            disabled
            type='checkbox'
            class='toggle toggle-primary'
            name='settingsLayoutAsGrid'
            checked={settings.layoutAsGrid}
            onClick={toggleLayoutAsGrid}
          />
        </label>
      </div> */}
			<div class="form-control">
				<label class="label hover:font-semibold">
					<span class="label-text min-w-max me-2">
						Results Per Page <span class="text-accent font-bold">{settings.resultsPerPage}</span>
					</span>
					<input
						type="range"
						class="range range-sm"
						min="1"
						max="100"
						value={settings.resultsPerPage}
						onChange={(e) => {
							const value = parseInt((e.target as HTMLInputElement).value);
							if (value >= 1 && value <= 100) {
								setResultsPerPage(value);
							} else {
								(e.target as HTMLInputElement).value = settings.resultsPerPage.toString();
							}
						}}
					/>
				</label>
			</div>
		</>
	);
};

export default DisplayFilters;
