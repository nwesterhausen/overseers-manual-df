import type { Component } from "solid-js";
import type { Creature } from "../../../src-tauri/bindings/Bindings";
import { FormatDescription } from "../../lib/CreatureUtil";
import CreatureBadges from "./CreatureBadges";

/**
 * Given a Creature, returns a listing entry for it.
 *
 * The CreatureListing is an accordion with a tabbed interior. The tabs are:
 *
 * - Description:
 *      Gives a description of the creature, followed by its known names and other details.
 *
 * - Raw Details:
 *      Some details on the raw file it was extracted from. This includes
 *
 * @param props - Contains the creature to render details for.
 * @returns Component of creature data for a listing.
 */
const CreatureCard: Component<{ creature: Creature }> = (props) => {
	return (
		<>
			<div class="card-badges">
				<CreatureBadges creature={props.creature} />
			</div>
			<div>{FormatDescription(props.creature)}</div>
		</>
	);
};

export default CreatureCard;
