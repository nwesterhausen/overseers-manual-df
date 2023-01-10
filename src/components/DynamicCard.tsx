import { Component, Match, Switch } from "solid-js";
import { Creature, DFPlant, Raw } from "../definitions/types";
import CreatureCard from "./creature/CreatureCard";
import BotanicalCard from "./plant/BotanicalCard";

const DynamicCard: Component<{ raw: Raw }> = (props) => {
    return (
        <Switch fallback={<p>No match for {props.raw.rawType}</p>}>
            <Match when={props.raw.rawType === "Plant"}>
                <BotanicalCard plant={props.raw as DFPlant} />
            </Match>
            <Match when={props.raw.rawType === "Creature"}>
                <CreatureCard creature={props.raw as Creature} />
            </Match>
        </Switch>
    )
}

export default DynamicCard;