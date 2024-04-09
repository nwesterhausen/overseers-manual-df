import { Component } from "solid-js";
import DisplayFilters from "../filtering/DisplayFilters";

const DisplayOptions: Component = () => {
	return (
		<div class="grid grid-cols-1 md:grid-cols-2 mb-3">
			<DisplayFilters />
		</div>
	);
};

export default DisplayOptions;
