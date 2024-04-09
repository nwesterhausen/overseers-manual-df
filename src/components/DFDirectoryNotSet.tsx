import { JSX } from "solid-js";
import { useSettingsContext } from "../providers/SettingsProvider";

function DFDirectoryNotSet(): JSX.Element {
	const [_settings, { openDirectorySelection }] = useSettingsContext();

	return (
		<div class="hero min-h-fit pt-16">
			<div class="hero-content flex-col md:flex-row">
				<img src="/icon.png" class="max-w-sm" />
				<div>
					<h1 class="text-5xl font-bold">Overseer's Reference Manual</h1>
					<p class="py-6">
						Welcome! This is a utility to help you be informed when making decisions in Dwarf Fortress. It is currently
						in development, and more features will be added over time. Before it can do anything, you need to set the
						path to your Dwarf Fortress game.
					</p>
					<p>
						To set the path to your Dwarf Fortress game, drag and drop the <code>gamelog.txt</code> file from the dwarf
						fortress directory onto this window, or use the button below to pull up a folder selection dialog.
					</p>
					<div class="float-right mt-8">
						<button
							class="btn btn-primary"
							onClick={() => {
								openDirectorySelection();
							}}
						>
							Set Directory
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DFDirectoryNotSet;
