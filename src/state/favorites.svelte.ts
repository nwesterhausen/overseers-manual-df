import {
  addFavoriteRaw,
  removeFavoriteRaw,
  retrieveFavoriteRaws,
} from "bindings/Commands";

async function saveFavoriteToDb(id: string, isAdding: boolean) {
  // You might have separate commands or one toggle command
  if (isAdding) {
    await addFavoriteRaw(id);
  } else {
    await removeFavoriteRaw(id);
  }
}

class FavoritesState {
  // We use a Set for O(1) lookup speed
  ids = $state(new Set<string>());

  constructor() {
    // Automatically load on creation (app startup)
    this.sync();
  }

  /**
   * Re-fetches the latest list from Rust
   */
  async sync() {
    try {
      const list = await retrieveFavoriteRaws();
      // Create a new Set to ensure reactivity triggers fully
      this.ids = new Set(list);
    } catch (e) {
      console.error("Failed to sync favorites:", e);
    }
  }

  /**
   * Checks if an ID is in the favorites list
   */
  has(id: string) {
    return this.ids.has(id);
  }

  /**
   * Toggles a favorite with Optimistic UI updates
   * (Updates UI immediately, then syncs with DB)
   */
  async toggle(id: string) {
    const isCurrentlyFavorite = this.ids.has(id);

    // Optimistic Update
    if (isCurrentlyFavorite) {
      this.ids.delete(id);
    } else {
      this.ids.add(id);
    }

    // Persist to Backend
    try {
      await saveFavoriteToDb(id, !isCurrentlyFavorite);
    } catch (e) {
      console.error("Failed to save favorite, reverting UI", e);
      // Revert on failure
      if (isCurrentlyFavorite) {
        this.ids.add(id);
      } else {
        this.ids.delete(id);
      }
    }
  }
}

export const favorites = new FavoritesState();
