/* @refresh reload */
import "bootswatch/dist/zephyr/bootstrap.css";
import "./custom.css";
import { render } from "solid-js/web";

import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
