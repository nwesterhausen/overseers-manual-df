import type { Metadata } from "../../src-tauri/bindings/Bindings.d.ts";

/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
	objectId: string;
	identifier: string;
	metadata: Metadata;

	// Added types for this app
	searchString: string;
	rawModuleParents?: string[];
	allTags?: string[];
	resultScore?: number;
};
