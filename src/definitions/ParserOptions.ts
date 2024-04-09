// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ObjectType } from "./ObjectType";
import type { RawModuleLocation } from "./RawModuleLocation";

export interface ParserOptions {
	attachMetadataToRaws: boolean;
	skipApplyCopyTagsFrom: boolean;
	skipApplyCreatureVariations: boolean;
	objectTypesToParse: Array<ObjectType>;
	locationsToParse: Array<RawModuleLocation>;
	dwarfFortressDirectory: string;
	legendsExportsToParse: Array<string>;
	rawFilesToParse: Array<string>;
	rawModulesToParse: Array<string>;
	moduleInfoFilesToParse: Array<string>;
	logSummary: boolean;
}
