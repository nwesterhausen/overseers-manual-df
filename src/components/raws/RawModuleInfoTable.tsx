import type { Component } from "solid-js";
import type { InfoFile } from "../../definitions/DFRawJson";

const RawModuleInfoTable: Component<{ module: InfoFile }> = (props) => {
	if (!props.module) {
		return <></>;
	}
	return (
		<table class="table table-sm">
			<tbody>
				<tr>
					<th>Name</th>
					<td>
						{props.module.name} v{props.module.displayedVersion}
					</td>
				</tr>
				<tr>
					<th>Author</th>
					<td>{props.module.author}</td>
				</tr>
				<tr>
					<th>Description</th>
					<td>{props.module.description}</td>
				</tr>
				<tr>
					<th>Identifier</th>
					<td>{props.module.identifier}</td>
				</tr>
				<tr>
					<th>Found in</th>
					<td>{props.module.location}</td>
				</tr>
			</tbody>
		</table>
	);
};

export default RawModuleInfoTable;
