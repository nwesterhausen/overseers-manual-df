export interface GameTicks {
  SEASON: number;
  WEEK: number;
  DAY: number;
  HOUR: number;
  MINUTE: number;
  SECOND: number;
}

/**
 * How many game ticks are in each unit of time (fortress mode).
 */
export const GAME_TICKS_FORTRESS: GameTicks = {
  SEASON: 33_6000,
  WEEK: 8_400,
  DAY: 1_200,
  HOUR: 50,
  MINUTE: 5 / 6,
  SECOND: 1 / 72,
};

/**
 * How many game ticks are in each unit of time (adventure mode).
 */
export const GAME_TICKS_ADVENTURE: GameTicks = {
  SEASON: 14_515_200,
  WEEK: 4_838_400,
  DAY: 172_800,
  HOUR: 7_200,
  MINUTE: 120,
  SECOND: 2,
};

/**
 * Convert a number of game ticks to a duration string.
 *
 * @param gameTicks - The number of game ticks to convert.
 * @param defined_spans - The game ticks to use for conversion.
 * @returns A string representing the duration of the game ticks. E.g. "1 Season, 2 Weeks, 3 Days, 4h 5m"
 */
export function SpecificTickToCalendarConversion(gameTicks: number, defined_spans: GameTicks): string {
  let mutGameTicks = gameTicks;
  // Convert ticks to "time" for fortress mode
  const seasons = Math.floor(mutGameTicks / defined_spans.SEASON);
  mutGameTicks -= defined_spans.SEASON * seasons;
  const weeks = Math.floor(mutGameTicks / defined_spans.WEEK);
  mutGameTicks -= defined_spans.WEEK * weeks;
  const days = Math.floor(mutGameTicks / defined_spans.DAY);
  mutGameTicks -= defined_spans.DAY * days;
  const hours = Math.floor(mutGameTicks / defined_spans.HOUR);
  mutGameTicks -= defined_spans.HOUR * hours;
  const minutes = Math.floor(mutGameTicks / defined_spans.MINUTE);
  mutGameTicks -= defined_spans.MINUTE * minutes;
  const seconds = Math.floor(mutGameTicks / defined_spans.SECOND);
  mutGameTicks -= defined_spans.SECOND * seconds;

  const outStr: string[] = [];
  if (seasons) {
    outStr.push(`${seasons} Season${seasons > 1 ? 's' : ''}`);
  }
  if (weeks) {
    outStr.push(`${weeks} Week${weeks > 1 ? 's' : ''}`);
  }
  if (days) {
    outStr.push(`${days} Day${days > 1 ? 's' : ''}`);
  }
  if (hours || minutes) {
    outStr.push(`${hours}h ${minutes}m`);
  }

  // Ignore hours minutes seconds for now?

  return outStr.join(', ');
}
