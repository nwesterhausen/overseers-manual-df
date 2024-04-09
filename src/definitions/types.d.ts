import { RawMetadata } from "./RawMetadata";

/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
	objectId: string;
	identifier: string;
	metadata: RawMetadata;

	// Added types for this app
	searchString: string;
	rawModuleParents?: string[];
	allTags?: string[];
	resultScore?: number;
};
