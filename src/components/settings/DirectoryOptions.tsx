import { invoke } from "@tauri-apps/api/core";
import { BiSolidFolderOpen } from "solid-icons/bi";
import type { JSX } from "solid-js";
import { COMMAND_SHOW_IN_FOLDER } from "../../lib/Constants";
import { useSettingsContext } from "../../providers/SettingsProvider";

function DirectoryOptions(): JSX.Element {
	const [settings, { openDirectorySelection, resetDirectorySelection }] = useSettingsContext();
	return (
		<div>
			<div class="flex flex-row gap-3">
				<span class="label">Current Dwarf Fortress Directory:</span>
				<div class="tooltip" data-tip="Show in Explorer">
					<button
						class="btn btn-sm btn-primary btn-outline border-none"
						onClick={() => {
							invoke(COMMAND_SHOW_IN_FOLDER, {
								path: `${settings.parsing.directoryPath}/gamelog.txt`,
							}).catch(console.error);
						}}
					>
						<BiSolidFolderOpen size={"1.5rem"} />
					</button>
				</div>
				<input type="text" placeholder={settings.parsing.directoryPath} class="input input-primary input-ghost grow" disabled />
			</div>
			<div class="flex justify-around my-2">
				<button
					class="btn btn-sm btn-error btn-outline"
					onClick={async () => {
						resetDirectorySelection();
					}}
				>
					Clear Dwarf Fortress Directory
				</button>
				<button
					class="btn btn-sm btn-primary"
					onClick={async () => {
						openDirectorySelection();
					}}
				>
					Change Dwarf Fortress Directory
				</button>
			</div>
		</div>
	);
}

export default DirectoryOptions;
