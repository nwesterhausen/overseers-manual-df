import { invoke } from "@tauri-apps/api/core";
import { Component, For, Show, createResource } from "solid-js";
import { Plant } from "../../definitions/Plant";
import { COMMAND_GET_BIOME_DESCRIPTION } from "../../lib/Constants";
import { GetPlantProvidesList } from "../../lib/PlantUtil";
import { UndergroundDepthDescription, toTitleCase } from "../../lib/Utils";

const PlantDescriptionTable: Component<{ plant: Plant }> = (props) => {
	const [biomes] = createResource(
		async () => {
			if (!props.plant.biomes) {
				return [];
			}
			const biomes = [];
			for (const biome of props.plant.biomes) {
				biomes.push(await invoke(COMMAND_GET_BIOME_DESCRIPTION, { biomeToken: biome }));
			}
			return biomes;
		},
		{
			initialValue: [],
		},
	);
	return (
		<table class="table table-sm">
			<tbody>
				<tr>
					<th>Likeable Features</th>
					<td>{props.plant.prefStrings ? props.plant.prefStrings.map((s) => toTitleCase(s)).join(", ") : "None"}</td>
				</tr>
				<tr>
					<th>Natural Habitat</th>
					<td>
						<Show when={biomes.latest.length > 0} fallback={<>No known biomes.</>}>
							<ul>
								<For each={biomes.latest}>{(biome) => <li>{biome}</li>}</For>
							</ul>
						</Show>
					</td>
				</tr>
				<tr>
					<th>Inhabited Depth</th>
					<td>{UndergroundDepthDescription(props.plant.undergroundDepth)}</td>
				</tr>
				<tr>
					<th>Used for:</th>
					<td>
						{GetPlantProvidesList(props.plant)
							.map((s) => toTitleCase(s))
							.join(", ")}
					</td>
				</tr>
				<Show when={props.plant.shrubDetails && Array.isArray(props.plant.shrubDetails.growingSeason)}>
					<tr>
						<th>Grows During</th>
						<td>{props.plant.shrubDetails.growingSeason.join(", ")}</td>
					</tr>
				</Show>
			</tbody>
		</table>
	);
};

export default PlantDescriptionTable;
