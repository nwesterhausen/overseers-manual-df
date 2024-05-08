import { type Component, For, Show } from "solid-js";
import type { Caste } from "../../definitions/DFRawJson";
import { FormatName, toTitleCase } from "../../lib/Utils";

const CreatureNamesTable: Component<{ castes: Caste[] }> = (props) => {
	return (
		<table class="table table-xs">
			<tbody>
				<For each={props.castes} fallback={<p>No name data.</p>}>
					{(caste) => (
						<Show when={caste.casteName}>
							<tr>
								<td>{toTitleCase(caste.identifier)}</td>
								<td>{FormatName(caste.casteName)}</td>
							</tr>
						</Show>
					)}
				</For>
			</tbody>
		</table>
	);
};

export default CreatureNamesTable;
