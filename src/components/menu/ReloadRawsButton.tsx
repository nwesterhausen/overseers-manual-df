import { BiRegularRefresh } from "solid-icons/bi";
import { Component } from "solid-js";
import { useRawsProvider } from "../../providers/RawsProvider";

const ReloadRawsButton: Component = () => {
	const rawsContext = useRawsProvider();
	return (
		<div class="tooltip tooltip-bottom" data-tip="Force Refresh Raws">
			<button class="btn btn-sm btn-ghost btn-circle hover:text-accent" onClick={() => rawsContext.setLoadRaws(true)}>
				<BiRegularRefresh size={"1.5rem"} />
			</button>
		</div>
	);
};

export default ReloadRawsButton;
