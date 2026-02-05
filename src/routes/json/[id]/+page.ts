import type { PageLoad } from "./$types";
import { getRawById } from "bindings/Commands";

export const load: PageLoad = async ({ params }) => {
  const rawId = params.id; // part of the path.. [id]

  try {
    // Fetch the specified raw
    const raw = await getRawById(rawId);
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
