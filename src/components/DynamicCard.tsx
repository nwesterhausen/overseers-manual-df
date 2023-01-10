import { Component, Match, Switch } from "solid-js";
import { Creature, DFInorganic, DFPlant, Raw } from "../definitions/types";
import CreatureCard from "./creature/CreatureCard";
import InorganicCard from "./inorganic/InorganicCard";
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
            <Match when={props.raw.rawType === "Inorganic"}>
                <InorganicCard inorganic={props.raw as DFInorganic} />
            </Match>
        </Switch>
    )
}

export default DynamicCard;