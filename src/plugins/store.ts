// Copyright 2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';

interface ChangePayload<T> {
  path: string;
  key: string;
  value: T | null;
}

/**
 * A key-value store persisted by the backend layer.
 */
export class Store {
  path: string;
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Inserts a key-value pair into the store.
   *
   * @param key -
   * @param value -
   * @returns
   */
  set(key: string, value: unknown): Promise<void> {
    return invoke<void>('plugin:store|set', {
      path: this.path,
      key,
      value,
    });
  }

  /**
   * Returns the value for the given `key` or `null` the key does not exist.
   *
   * @param key -
   * @returns
   */
  get<T>(key: string): Promise<T | null> {
    return invoke('plugin:store|get', {
      path: this.path,
      key,
    });
  }

  /**
   * Returns `true` if the given `key` exists in the store.
   *
   * @param key -
   * @returns
   */
  has(key: string): Promise<boolean> {
    return invoke('plugin:store|has', {
      path: this.path,
      key,
    });
  }

  /**
   * Removes a key-value pair from the store.
   *
   * @param key -
   * @returns
   */
  delete(key: string): Promise<boolean> {
    return invoke('plugin:store|delete', {
      path: this.path,
      key,
    });
  }

  /**
   * Clears the store, removing all key-value pairs.
   *
   * Note: To clear the storage and reset it to it's `default` value, use `reset` instead.
   * @returns
   */
  clear(): Promise<void> {
    return invoke('plugin:store|clear', {
      path: this.path,
    });
  }

  /**
   * Resets the store to it's `default` value.
   *
   * If no default value has been set, this method behaves identical to `clear`.
   * @returns
   */
  reset(): Promise<void> {
    return invoke('plugin:store|reset', {
      path: this.path,
    });
  }

  /**
   * Returns a list of all key in the store.
   *
   * @returns
   */
  keys(): Promise<string[]> {
    return invoke('plugin:store|keys', {
      path: this.path,
    });
  }

  /**
   * Returns a list of all values in the store.
   *
   * @returns
   */
  values(): Promise<string[]> {
    return invoke('plugin:store|values', {
      path: this.path,
    });
  }

  /**
   * Returns a list of all entries in the store.
   *
   * @returns
   */
  entries<T>(): Promise<[key: string, value: T][]> {
    return invoke('plugin:store|entries', {
      path: this.path,
    });
  }

  /**
   * Returns the number of key-value pairs in the store.
   *
   * @returns
   */
  length(): Promise<string[]> {
    return invoke('plugin:store|length', {
      path: this.path,
    });
  }

  /**
   * Attempts to load the on-disk state at the stores `path` into memory.
   *
   * This method is useful if the on-disk state was edited by the user and you want to synchronize the changes.
   *
   * Note: This method does not emit change events.
   * @returns
   */
  load(): Promise<void> {
    return invoke('plugin:store|load', {
      path: this.path,
    });
  }

  /**
   * Saves the store to disk at the stores `path`.
   *
   * As the store is only persisted to disk before the apps exit, changes might be lost in a crash.
   * This method let's you persist the store to disk whenever you deem necessary.
   * @returns
   */
  save(): Promise<void> {
    return invoke('plugin:store|save', {
      path: this.path,
    });
  }

  /**
   * Listen to changes on a store key.
   * @param key -
   * @param cb -
   * @returns A promise resolving to a function to unlisten to the event.
   */
  onKeyChange<T>(key: string, cb: (value: T | null) => void): Promise<UnlistenFn> {
    return appWindow.listen<ChangePayload<T>>('store://change', (event) => {
      if (event.payload.path === this.path && event.payload.key === key) {
        cb(event.payload.value);
      }
    });
  }

  /**
   * Listen to changes on the store.
   * @param cb -
   * @returns A promise resolving to a function to unlisten to the event.
   */
  onChange(cb: (key: string, value: unknown) => void): Promise<UnlistenFn> {
    return appWindow.listen<ChangePayload<unknown>>('store://change', (event) => {
      if (event.payload.path === this.path) {
        cb(event.payload.key, event.payload.value);
      }
    });
  }
}