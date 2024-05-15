import { createContextProvider } from "@solid-primitives/context";
import { invoke } from "@tauri-apps/api/core";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { createMemo, createResource, createSignal } from "solid-js";
import { NO_UPDATE } from "../lib/Constants";

export const [UpdateProvider, useUpdateProvider] = createContextProvider(() => {
	// Resource for the update status
	const [update, { refetch }] = createResource(
		async () => {
			const status = await check();
			if (typeof status !== "undefined" && status !== null) {
				console.log(`⁂ Update Available: ${status.currentVersion} → ${status.version} ⁂`);
				return status;
			}
			return NO_UPDATE;
		},
		{
			initialValue: NO_UPDATE,
		},
	);

	// Signal to indicate update was skipped
	const [updateSkipped, setUpdateSkipped] = createSignal(false);

	function checkForUpdates() {
		refetch();
	}

	function skipUpdate() {
		invoke("plugin:aptabase|track_event", {
			name: "skip_update",
			props: {
				to_version: update.latest.version,
				current_version: update.latest.currentVersion,
			},
		});
		setUpdateSkipped(true);
	}

	const updateAvailable = createMemo(() => {
		return update.latest.version !== update.latest.currentVersion && update.latest.version !== NO_UPDATE.version && updateSkipped() === false;
	});

	async function applyUpdate() {
		if (updateAvailable()) {
			invoke("plugin:aptabase|track_event", { name: "apply_update", props: { to_version: update.latest.version } });
			await update.latest.downloadAndInstall();
			await relaunch();
		}
	}

	const updateVersion = createMemo(() => update.latest.version);
	const updateDetails = createMemo(() => update.latest.body.trim());

	return {
		updateVersion,
		updateDetails,
		updateAvailable,
		checkForUpdates,
		skipUpdate,
		updateSkipped,
		applyUpdate,
	};
});
