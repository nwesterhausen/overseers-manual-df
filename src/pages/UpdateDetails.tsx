import { useNavigate } from "@solidjs/router";
import { JSX, Show } from "solid-js";
import { useUpdateProvider } from "../providers/UpdateProvider";

function UpdateDetails(): JSX.Element {
	const updateContext = useUpdateProvider();
	const navigate = useNavigate();

	return (
		<div class="prose p-8 mx-auto">
			<Show when={updateContext.updateAvailable()} fallback={<h1>No Update Available</h1>}>
				<h1>Update to {updateContext.updateVersion()}</h1>
			</Show>
			<pre>{updateContext.updateDetails()}</pre>
			<p>
				Full changelog available{" "}
				<a href="https://github.com/nwesterhausen/overseers-manual-df/blob/main/docs/CHANGELOG.md" target="_blank">
					online
				</a>
				.
			</p>
			<div class="flex flex-row justify-between">
				<button
					class="btn btn-secondary"
					onClick={() => {
						updateContext.skipUpdate();
						navigate("/");
					}}
				>
					Skip this version
				</button>
				<button
					class="btn btn-primary"
					onClick={async () => {
						await updateContext.applyUpdate();
					}}
				>
					Download and Install
				</button>
			</div>
		</div>
	);
}

export default UpdateDetails;
