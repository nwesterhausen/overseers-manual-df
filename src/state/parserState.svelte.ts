import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import {
  PARSING_EVENT_LOG,
  type LogLevel,
  type ParsingEventPayload,
} from "bindings/Structs";

class ParserLogManager {
  // Define reactive state
  currentLog: string = $state("Idle");
  currentLogLevel: LogLevel = $state("info");
  history: string[] = $state([]);

  // An unlisten function which is used to prevent double initialization
  private _unlisten: UnlistenFn | null = null;

  constructor() {
    // Automatically start listening when this class is instantiated
    this.initListener();
  }

  private async initListener() {
    await listen<ParsingEventPayload>(PARSING_EVENT_LOG, (event) => {
      const payload = event.payload;
      this.currentLog = payload.message;
      this.currentLogLevel = payload.level.toLocaleLowerCase() as LogLevel;

      // Keep only the last 50 logs in history
      this.history = [payload.message, ...this.history].slice(0, 50);
    });
  }

  public reset() {
    this.currentLog = "Idle";
    this.currentLogLevel = "info";
    this.history = [];
  }

  public destroy() {
    if (this._unlisten) {
      this._unlisten();
    }
  }
}

// Export a single instance to be used globally
export const parserLogs = new ParserLogManager();
