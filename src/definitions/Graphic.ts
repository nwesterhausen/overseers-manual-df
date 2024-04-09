// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CustomGraphicExtension } from "./CustomGraphicExtension";
import type { GraphicType } from "./GraphicType";
import type { RawMetadata } from "./RawMetadata";
import type { SpriteGraphic } from "./SpriteGraphic";
import type { SpriteLayer } from "./SpriteLayer";

export interface Graphic {
	metadata: RawMetadata;
	identifier: string;
	objectId: string;
	casteIdentifier: string;
	kind: GraphicType;
	sprites: Array<SpriteGraphic>;
	layers: Array<[string, Array<SpriteLayer>]>;
	growths: Array<[string, Array<SpriteGraphic>]>;
	customExtensions: Array<CustomGraphicExtension>;
	tags: Array<string>;
}
