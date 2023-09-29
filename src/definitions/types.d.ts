import { Name } from './Name';
import { RawMetadata } from './RawMetadata';

/**
 * The common similarities amongst all raw definitions.
 */
export type Raw = {
  type: string;
  objectId: string;
  name: Name;
  identifier: string;
  metadata: RawMetadata;
  tags: string[];

  // Added types for this app
  searchString: string;
  rawModuleParents?: string[];
  allTags?: string[];
  resultScore?: number;
};
