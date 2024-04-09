import { Component } from "solid-js";
import RawLocationCheckboxes from "../filtering/RawLocationCheckboxes";

const LocationOptions: Component = () => {
	return (
		<div class="grid grid-cols-1 sm:grid-cols-2 mb-3">
			<RawLocationCheckboxes />
		</div>
	);
};

export default LocationOptions;
