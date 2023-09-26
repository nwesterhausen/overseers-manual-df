/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
  objectId: string;
  identifier: string;
  name: string;
  parentRaw: string;
  tags: string[];
  rawModule: string;
  moduleVersion: string;
  moduleSourceDirectory: string;
  moduleDisplayName: string;
  rawType: string;
  rawRelativePath: string;
  overwriteRaw: string;

  // Added types for this app
  searchString: string;
  rawModuleParents?: string[];
  allTags?: string[];
  resultScore?: number;
};
