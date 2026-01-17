import { invoke } from "@tauri-apps/api/core";
import type { PageLoad } from "./$types";
import type { RawObject } from "bindings/DFRawParser";

export const load: PageLoad = async ({ params }) => {
  const rawId = params.id; // part of the path.. [id]

  try {
    // Fetch the specified raw
    const raw = await invoke<RawObject>("get_raw_by_id", { id: rawId });
    return {
      details: raw,
    };
  } catch (error) {
    console.error("Failed to load raw details:", error);
    return {
      details: null,
      error: "Raw entry not found",
    };
  }
};
