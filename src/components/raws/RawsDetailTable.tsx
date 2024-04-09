import { Component } from "solid-js";
import { Raw } from "../../definitions/types";

const RawJsonTable: Component<{ raw: Raw }> = (props) => {
	return (
		<>
			<table class="table table-sm">
				<tbody>
					<tr>
						<th>Identifier</th>
						<td>{props.raw.identifier}</td>
						<th>Raw Type</th>
						<td>{props.raw.metadata.objectType}</td>
					</tr>
					<tr>
						<th>Raw file</th>
						<td>{props.raw.metadata.rawIdentifier}</td>
					</tr>
					<tr>
						<th>Raw file exact path</th>
						<th>{props.raw.metadata.rawFilePath}</th>
					</tr>
					<tr>
						<th>ObjectID</th>
						<td>{props.raw.objectId}</td>
					</tr>
					<tr>
						<th>Raws as JSON</th>
						<td>
							<pre class="p-1 text-muted">{JSON.stringify(props.raw, null, 2)}</pre>
						</td>
					</tr>
					{/* <tr>
            <th>Graphics Raws</th>
            <td>
              <pre class='p-1 text-muted'>
                {JSON.stringify(rawsContext.allGraphicsFor(props.item.identifier), null, 2)}
              </pre>
            </td>
          </tr> */}
				</tbody>
			</table>
		</>
	);
};

export default RawJsonTable;
