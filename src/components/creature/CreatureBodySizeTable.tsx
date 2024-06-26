import { type Component, For } from "solid-js";
import type { Caste } from "../../../src-tauri/bindings/Bindings";
import { BodySizeStatus } from "../../lib/CreatureUtil";
import { toTitleCase } from "../../lib/Utils";

const CreatureBodySizeTable: Component<{ castes: Caste[] }> = (props) => {
	return (
		<table class="table table-xs">
			<tbody>
				<For each={props.castes} fallback={<p>No body size data.</p>}>
					{(caste) =>
						caste.bodySize && caste.bodySize.length > 0 ? (
							<tr>
								<td>{toTitleCase(caste.identifier)}</td>
								<td>
									<div class="join join-vertical gap-0">
										<For each={caste.bodySize}>{(size) => <span>{BodySizeStatus(size)}</span>}</For>
									</div>
								</td>
							</tr>
						) : (
							""
						)
					}
				</For>
			</tbody>
		</table>
	);
};

export default CreatureBodySizeTable;
