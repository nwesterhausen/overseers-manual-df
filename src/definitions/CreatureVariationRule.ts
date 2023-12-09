// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export type CreatureVariationRule =
  | "Unknown"
  | { RemoveTag: { tag: string; value: string | null } }
  | { NewTag: { tag: string; value: string | null } }
  | { AddTag: { tag: string; value: string | null } }
  | {
      ConvertTag: {
        tag: string;
        target: string | null;
        replacement: string | null;
      };
    }
  | {
      ConditionalNewTag: {
        tag: string;
        value: string | null;
        argument_index: number;
        argument_requirement: string;
      };
    }
  | {
      ConditionalAddTag: {
        tag: string;
        value: string | null;
        argument_index: number;
        argument_requirement: string;
      };
    }
  | {
      ConditionalRemoveTag: {
        tag: string;
        value: string | null;
        argument_index: number;
        argument_requirement: string;
      };
    }
  | {
      ConditionalConvertTag: {
        tag: string;
        target: string | null;
        replacement: string | null;
        argument_index: number;
        argument_requirement: string;
      };
    };
