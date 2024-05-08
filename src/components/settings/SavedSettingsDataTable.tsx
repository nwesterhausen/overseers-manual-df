import type { Component } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";

const SavedSettingsDataTable: Component = () => {
	const [settings] = useSettingsContext();

	return (
		<table class="table table-xs">
			{/* Create a table for all the settings values we save to disk, to display them. */}
			<thead>
				<tr>
					<th>Setting Key</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{/* Data Version */}
				<tr>
					<td>dataVersion</td>
					<td>{settings.dataVersion}</td>
				</tr>
				{/* Directory Path */}
				<tr>
					<td>parsing → directoryPath</td>
					<td>{settings.parsing.directoryPath}</td>
				</tr>
				{/* Display Graphics */}
				<tr>
					<td>displayGraphics</td>
					<td>{settings.displayGraphics.toString()}</td>
				</tr>
				{/* Layout As Grid */}
				<tr>
					<td>layoutAsGrid</td>
					<td>{settings.layoutAsGrid.toString()}</td>
				</tr>
				{/* Parse Locations */}
				<tr>
					<td>parsing → locations</td>
					<td>{settings.parsing.locations.join(", ")}</td>
				</tr>
				{/* Parse Object Types */}
				<tr>
					<td>parsing → objectTypes</td>
					<td>{settings.parsing.objectTypes.join(", ")}</td>
				</tr>
				{/* Parse Specific Raw Files */}
				<tr>
					<td>parsing → rawFiles</td>
					<td>{settings.parsing.rawFiles.join(", ")}</td>
				</tr>
				{/* Parse Specific Raw Modules */}
				<tr>
					<td>parsing → rawModules</td>
					<td>{settings.parsing.rawModules.join(", ")}</td>
				</tr>
				{/* Parse Specific Legends Exports */}
				<tr>
					<td>parsing → legendsExports</td>
					<td>{settings.parsing.legendsExports.join(", ")}</td>
				</tr>
				{/* Parse Specific Module `info.txt` files */}
				<tr>
					<td>parsing → moduleInfoFiles</td>
					<td>{settings.parsing.moduleInfoFiles.join(", ")}</td>
				</tr>
				{/* Filter Locations */}
				<tr>
					<td>filtering → locations</td>
					<td>{settings.filtering.locations.join(", ")}</td>
				</tr>
				{/* Filtered Object Types */}
				<tr>
					<td>filtering → objectTypes</td>
					<td>{settings.filtering.objectTypes.join(", ")}</td>
				</tr>
				{/* Filter Biomes */}
				<tr>
					<td>filtering → biomes</td>
					<td>{settings.filtering.biomes.length === 0 ? "All" : settings.filtering.biomes.join(", ")}</td>
				</tr>
				{/* Filter Modules */}
				<tr>
					<td>filtering → modules</td>
					<td>{settings.filtering.modules.length === 0 ? "All" : settings.filtering.modules.join(", ")}</td>
				</tr>
				{/* Results Per Page */}
				<tr>
					<td>resultsPerPage</td>
					<td>{settings.resultsPerPage}</td>
				</tr>
				{/* Current Page */}
				<tr>
					<td>currentPage</td>
					<td>{settings.currentPage}</td>
				</tr>
				{/* Total Pages */}
				<tr>
					<td>totalPages</td>
					<td>{settings.totalPages}</td>
				</tr>
				{/* Total Results */}
				<tr>
					<td>totalResults</td>
					<td>{settings.totalResults}</td>
				</tr>
			</tbody>
		</table>
	);
};

export default SavedSettingsDataTable;
