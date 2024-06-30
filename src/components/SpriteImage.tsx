import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { BiRegularCaretLeft, BiRegularCaretRight, BiRegularImageAlt } from "solid-icons/bi";
import { type Component, Show, createMemo, createResource, createSignal } from "solid-js";
import type { GraphicsResults } from "../../src-tauri/bindings/Bindings.d.ts";
import { COMMAND_GET_GRAPHICS_FOR_IDENTIFIER } from "../lib/Constants";
import { toTitleCase } from "../lib/Utils";
import { useSettingsContext } from "../providers/SettingsProvider";

interface Dimensions {
	x: number;
	y: number;
}
export interface SpriteImageProps {
	identifier: string;
	class?: string;
}

interface SpriteImageDetail {
	graphicFilePath: string;
	offset: Dimensions;
	offset2: Dimensions;
	pageDim: Dimensions;
	tileDim: Dimensions;
	description?: string;
}

//Todo: Handle multiple sprites (either cycle between them or let user cycle between them)

const SpriteImage: Component<SpriteImageProps> = (props) => {
	const [currentSettings] = useSettingsContext();

	const [graphics] = createResource<GraphicsResults>(
		async () => {
			return await invoke(COMMAND_GET_GRAPHICS_FOR_IDENTIFIER, {
				options: {
					identifier: props.identifier,
					allGraphics: true,
				},
			});
		},
		{
			initialValue: {
				matchingGraphics: undefined,
				tilePages: [],
			},
		},
	);

	const [currentIndex, setCurrentIndex] = createSignal(0);

	const spriteDetails = createMemo((): SpriteImageDetail[] => {
		if (typeof graphics.latest.matchingGraphics === "undefined" || graphics.latest.tilePages.length === 0) {
			return [
				{
					graphicFilePath: "",
					offset: { x: 0, y: 0 },
					offset2: { x: 0, y: 0 },
					tileDim: { x: 0, y: 0 },
					pageDim: { x: 0, y: 0 },
				},
			];
		}
		const results: SpriteImageDetail[] = [];
		for (const graphic of graphics.latest.matchingGraphics) {
			// technically this is different for each isn't it...
			if (graphic.sprites && graphic.sprites.length > 0) {
				for (const sprite of graphic.sprites) {
					const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === sprite.tilePageId);
					if (tilePage.file.length > 0) {
						results.push({
							graphicFilePath: tilePage.file,
							offset: sprite.offset,
							offset2: sprite.offset2,
							tileDim: tilePage.tileDim,
							pageDim: tilePage.pageDim,
							description: sprite.primaryCondition || "",
						});
					}
				}
			} else if (graphic.layers.length > 0) {
				// const layer = graphic.layers[0][1][0];
				for (const [layerIdentifier, layers] of graphic.layers) {
					for (const layer of layers) {
						const tilePage = graphics.latest.tilePages.find((tp) => tp.identifier === layer.tilePageId);
						if (tilePage.file.length > 0) {
							results.push({
								graphicFilePath: tilePage.file,
								offset: layer.offset,
								offset2: layer.offset2,
								tileDim: tilePage.tileDim,
								pageDim: tilePage.pageDim,
								description: toTitleCase(`${layerIdentifier || ""} ${layer.layerName || ""}`),
							});
						}
					}
				}
			}
		}
		return results;
	});

	const [allowCycle, setAllowCycle] = createSignal(true);
	const [cycleTimeout, setCycleTimeout] = createSignal(setTimeout(() => {}, 0));

	function incrementIndex() {
		if (spriteDetails().length > 0) {
			if (currentIndex() + 1 >= spriteDetails().length) {
				setCurrentIndex(0);
			} else {
				setCurrentIndex(currentIndex() + 1);
			}
		} else {
			setCurrentIndex(0);
		}
	}

	function decrementIndex() {
		if (spriteDetails().length > 0) {
			if (currentIndex() - 1 < 0) {
				setCurrentIndex(spriteDetails().length - 1);
			} else {
				setCurrentIndex(currentIndex() - 1);
			}
		} else {
			setCurrentIndex(0);
		}
	}

	setInterval(() => {
		if (allowCycle() === true) {
			incrementIndex();
		}
	}, 5 * 1000);

	const assetUrl = createMemo(() => {
		if (spriteDetails().length > 0) {
			if (spriteDetails()[currentIndex()].graphicFilePath.length > 0) {
				const filePath = spriteDetails()[currentIndex()].graphicFilePath.replace(/\\/g, "/");
				const assetUrl = convertFileSrc(filePath);
				return assetUrl;
			}
		}
		return "";
	});

	const offsetX = createMemo(() => {
		let offX = spriteDetails()[currentIndex()].offset.x;
		if (spriteDetails()[currentIndex()].offset2 && spriteDetails()[currentIndex()].offset2.x > offX) {
			offX = spriteDetails()[currentIndex()].offset2.x;
		}
		return offX;
	});
	const offsetY = createMemo(() => {
		let offY = spriteDetails()[currentIndex()].offset.y;
		if (spriteDetails()[currentIndex()].offset2 && spriteDetails()[currentIndex()].offset2.y > offY) {
			offY = spriteDetails()[currentIndex()].offset2.y;
		}
		return offY;
	});
	const dimX = createMemo(() => {
		const scale = offsetX() - spriteDetails()[currentIndex()].offset.x + 1;
		return spriteDetails()[currentIndex()].tileDim.x * scale;
	});
	const dimY = createMemo(() => {
		const scale = offsetY() - spriteDetails()[currentIndex()].offset.y + 1;
		return spriteDetails()[currentIndex()].tileDim.y * scale;
	});
	const positionOffset = createMemo(() => {
		return `${spriteDetails()[currentIndex()].pageDim.x - (offsetX() + 1) * spriteDetails()[currentIndex()].tileDim.x + dimX()}px ${
			spriteDetails()[currentIndex()].pageDim.y - (offsetY() + 1) * spriteDetails()[currentIndex()].tileDim.y + dimY()
		}px`;
	});
	return (
		<Show
			when={currentSettings.displayGraphics && spriteDetails()[currentIndex()].graphicFilePath.length > 0}
			fallback={
				<div class="tooltip" data-tip={graphics.loading ? "Loading graphics.." : "No Graphics Found"}>
					<div
						class={`border-2 rounded-lg border-accent bg-black/50 ${props.class}`}
						style={{
							width: "32px",
							height: "32px",
							padding: "7px",
						}}
					>
						{graphics.loading ? (
							<div class="loading loading-dots loading-xs" style={{ width: "1rem", height: "1rem" }} />
						) : (
							<BiRegularImageAlt />
						)}
					</div>
				</div>
			}
		>
			<div class={`border-2 rounded-lg border-accent bg-black/50 ${props.class} relative`}>
				<button
					type="button"
					class="absolute inset-y-0 -right-3"
					onClick={() => {
						setAllowCycle(false);
						incrementIndex();
						clearTimeout(cycleTimeout());
						setCycleTimeout(setTimeout(() => setAllowCycle(true), 15 * 1000));
					}}
				>
					<BiRegularCaretRight class="hover:text-accent" />
				</button>
				<button
					type="button"
					class="absolute inset-y-0 -left-3"
					onClick={() => {
						setAllowCycle(false);
						decrementIndex();
						clearTimeout(cycleTimeout());
						setCycleTimeout(setTimeout(() => setAllowCycle(true), 15 * 1000));
					}}
				>
					<BiRegularCaretLeft class="hover:text-accent" />
				</button>

				<span
					class="absolute -bottom-3 -left-6 text-center text-accent w-20"
					style={{
						"font-size": "0.5rem",
						"line-height": "0.5rem",
					}}
				>
					{spriteDetails()[currentIndex()].description}
				</span>
				<div
					style={{
						width: `${dimX()}px`,
						height: `${dimY()}px`,
						"background-image": `url("${assetUrl()}")`,
						"background-position": positionOffset(),
					}}
				/>
			</div>
		</Show>
	);
};

export default SpriteImage;
