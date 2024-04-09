import { Component, For, Show } from "solid-js";
import { Caste } from "../../definitions/Caste";
import { toTitleCase } from "../../lib/Utils";

const CreatureMilkTable: Component<{ values: Caste[]; fallbackDesc: string }> = (props) => {
	return (
		<table class="table table-xs">
			<tbody>
				<For each={props.values} fallback={<p>{props.fallbackDesc}</p>}>
					{(caste) => (
						<Show when={caste.milkable}>
							<tr>
								<td>{toTitleCase(caste.identifier)}</td>
								<td>
									Produces {caste.milkable.material} every {caste.milkable.frequency} ticks
								</td>
							</tr>
						</Show>
					)}
				</For>
			</tbody>
		</table>
	);
};

export default CreatureMilkTable;
