import { invoke } from "@tauri-apps/api/core";
import { BiRegularQuestionMark, BiSolidCat, BiSolidCity, BiSolidDiamond, BiSolidSearch, BiSolidTree } from "solid-icons/bi";
import { type Component, Match, Show, Switch, createResource } from "solid-js";
import type { Creature, Plant } from "../../src-tauri/bindings/Bindings";
import type { Raw } from "../definitions/types";
import { COMMAND_GET_SEARCH_STRING_FOR_OBJECT } from "../lib/Constants";
import { nameForRaw } from "../lib/Raw";
import SpriteImage from "./SpriteImage";
import CreatureDescriptionTable from "./creature/CreateDescriptionTable";
import CreatureCard from "./creature/CreatureCard";
import BotanicalCard from "./plant/BotanicalCard";
import PlantDescriptionTable from "./plant/PlantDescriptionTable";
import RawJsonTable from "./raws/RawsDetailTable";

const DynamicCard: Component<{ raw: Raw }> = (props) => {
	const listingId = `${props.raw.objectId} listing`;

	const [searchString] = createResource<string>(
		async (): Promise<string> => {
			const searchString = await invoke(COMMAND_GET_SEARCH_STRING_FOR_OBJECT, { objectId: props.raw.objectId });
			if (typeof searchString === "string") {
				return searchString;
			}
			return "";
		},
		{
			initialValue: "",
		},
	);

	return (
		<div class="card card-compact w-72 bg-neutral/25" id={listingId}>
			<div class="w-100 flex justify-center absolute inset-x-0 top-1">
				<div class="tooltip tooltip-bottom" data-tip={`Search string: "${searchString.latest}"`}>
					<div class="text-slate-500">
						<BiSolidSearch />
					</div>
				</div>
			</div>
			<div class="top-1 right-1 absolute tooltip tooltip-bottom" data-tip={props.raw.metadata.objectType}>
				<Switch fallback={<BiRegularQuestionMark />}>
					<Match when={props.raw.metadata.objectType === "Plant"}>
						<BiSolidTree />
					</Match>
					<Match when={props.raw.metadata.objectType === "Creature"}>
						<BiSolidCat />
					</Match>
					<Match when={props.raw.metadata.objectType === "Entity"}>
						<BiSolidCity />
					</Match>
					<Match when={props.raw.metadata.objectType === "Inorganic"}>
						<BiSolidDiamond />
					</Match>
				</Switch>
			</div>
			<div class="card-body">
				<div>
					<div class="card-title">{nameForRaw(props.raw)}</div>
					<Show
						when={props.raw && props.raw.metadata && props.raw.metadata.moduleName && props.raw.metadata.moduleVersion}
						fallback={<div class="text-muted italic text-xs">No metadata {props.raw.objectId}</div>}
					>
						<div class="text-muted italic text-xs">
							{props.raw.metadata.moduleName} {props.raw.metadata.moduleVersion}
						</div>
					</Show>
					<div class="absolute right-6 top-6">
						<SpriteImage identifier={props.raw.identifier} />
					</div>
				</div>
				<Switch fallback={""}>
					<Match when={props.raw.metadata.objectType === "Plant"}>
						<BotanicalCard plant={props.raw as unknown as Plant} />
					</Match>
					<Match when={props.raw.metadata.objectType === "Creature"}>
						<CreatureCard creature={props.raw as unknown as Creature} />
					</Match>
					<Match when={props.raw.metadata.objectType === "Entity"}>
						<CreatureCard creature={props.raw as unknown as Creature} />
					</Match>
				</Switch>
			</div>

			<div class="flex flex-row justify-between">
				<button
					type="button"
					class="btn btn-primary btn-sm"
					onClick={() => {
						const dialog = document.getElementById(`${props.raw.objectId}-details`) as HTMLDialogElement;
						dialog?.showModal();
					}}
				>
					Show All Details
				</button>
				<button
					type="button"
					onClick={() => {
						const dialog = document.getElementById(`${props.raw.objectId}-raws`) as HTMLDialogElement;
						dialog?.showModal();
					}}
					class="btn btn-sm btn-ghost"
				>
					See Raw Info
				</button>
			</div>

			{/* Include modal for "Show All Details" */}
			<dialog class="modal" id={`${props.raw.objectId}-details`}>
				<div class="modal-box w-11/12 max-w-5xl">
					<h3 class="font-bold text-lg">{nameForRaw(props.raw)} Details</h3>
					<Switch fallback={""}>
						<Match when={props.raw.metadata.objectType === "Plant"}>
							<PlantDescriptionTable plant={props.raw as unknown as Plant} />
						</Match>
						<Match when={props.raw.metadata.objectType === "Creature"}>
							<CreatureDescriptionTable creature={props.raw as unknown as Creature} />
						</Match>
					</Switch>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button type="button">close</button>
				</form>
			</dialog>

			{/* Include modal for "See Raw Info" */}
			<dialog class="modal" id={`${props.raw.objectId}-raws`}>
				<div class="modal-box w-11/12 max-w-5xl">
					<h3 class="font-bold text-lg">{nameForRaw(props.raw)} Details</h3>
					<RawJsonTable raw={props.raw} />
				</div>
				<form method="dialog" class="modal-backdrop">
					<button type="button">close</button>
				</form>
			</dialog>
		</div>
	);
};

export default DynamicCard;
