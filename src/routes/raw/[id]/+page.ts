import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { RawObject } from "bindings/DFRawParser";
import { highlightJson } from "helpers";

export const load: PageLoad = async ({ params }) => {
  const rawId = params.id; // part of the path.. [id]

  try {
    // Fetch the specified raw
    const raw = await invoke<RawObject>("get_raw_by_id", { id: rawId });
    // Get nice looking code to display
    const shikiJson = await highlightJson(JSON.stringify(raw, null, 2));
    return {
      details: raw,
      code: shikiJson,
    };
  } catch (error) {
    console.error("Failed to load raw details:", error);
    return {
      details: null,
      error: "Raw entry not found",
    };
  }
};
