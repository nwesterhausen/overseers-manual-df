import { BiRegularFilter } from "solid-icons/bi";
import type { Component } from "solid-js";
import BiomeFiltering from "./BiomeFiltering";
import DisplayFilters from "./DisplayFilters";
import ModuleFiltering from "./ModuleFiltering";
import RawLocationCheckboxes from "./RawLocationCheckboxes";
import RawTypeCheckboxes from "./RawTypeCheckboxes";

const FilterButton: Component = () => {
	return (
		<details class="fixed top-14 left-0 dropdown z-[2]">
			<summary class="btn btn-xs btn-accent border-0 rounded-none rounded-r-lg items-center h-8 align-middle">
				<BiRegularFilter size={"1.5rem"} />
				Show/Hide
				<br />
				Filters
			</summary>
			<div class="relative z-[1] m-1 w-full max-w-sm rounded-lg bg-base-100 border-2 border-slate-200/25">
				<div class="join join-vertical">
					<div class="collapse collapse-arrow join-item bg-base-100 border-b-2 border-b-slate-200/25">
						<input type="radio" name="filter-accordion" />
						<div class="collapse-title font-medium">Display Options</div>
						<div class="collapse-content">
							<DisplayFilters />
						</div>
					</div>
					<div class="collapse collapse-arrow join-item bg-base-100 border-b-2 border-b-slate-200/25">
						<input type="radio" name="filter-accordion" />
						<div class="collapse-title font-medium">Object Types</div>
						<div class="collapse-content">
							<RawTypeCheckboxes />
						</div>
					</div>
					<div class="collapse collapse-arrow join-item bg-base-100 border-b-2 border-b-slate-200/25">
						<input type="radio" name="filter-accordion" />
						<div class="collapse-title font-medium">Biomes</div>
						<div class="collapse-content">
							<BiomeFiltering />
						</div>
					</div>
					<div class="collapse collapse-arrow join-item bg-base-100 border-b-2 border-b-slate-200/25">
						<input type="radio" name="filter-accordion" />
						<div class="collapse-title font-medium">Raw Locations</div>
						<div class="collapse-content">
							<RawLocationCheckboxes />
						</div>
					</div>
					<div class="collapse collapse-arrow join-item bg-base-100 border-b-2 border-b-slate-200/25">
						<input type="radio" name="filter-accordion" />
						<div class="collapse-title font-medium">Module Inclusion</div>
						<div class="collapse-content">
							<ModuleFiltering />
						</div>
					</div>
				</div>
			</div>
		</details>
	);
};

export default FilterButton;
