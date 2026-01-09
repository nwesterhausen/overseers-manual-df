/**
 * Turns a string into one with the first letter of each word in upper case.
 *
 * @param str string to turn into title case
 * @param force whether to make all other letters lowercase, false by default
 * @returns title case formatted string
 */
export const toTitleCase = function (
  str: string,
  force: boolean = false,
): string {
  if (str.length <= 1) {
    return str.toLocaleUpperCase();
  }

  let splitStr = str.split(" ");
  if (splitStr.length > 1) {
    return splitStr.map((s) => toTitleCase(s)).join(" ");
  }

  if (force) {
    return str[0].toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
  }
  return str[0].toLocaleUpperCase() + str.substring(1);
};

/**
 * Transform an array of strings in to a string list, joined with commas and 'and'.
 *
 * @param arr array to transform
 * @returns A comma and 'and' separated string of the array
 */
export const intoAndList = function (arr: string[]): string {
  if (arr.length <= 1) {
    return arr.join("");
  }

  const lastItem = arr.pop();
  if (typeof lastItem !== "undefined") {
    let newLastItem = "and " + lastItem;
    return [...arr, newLastItem].join(", ");
  }
  return arr.join(", ");
};

/**
 * Compare two javascript objects and check for deep equality.
 *
 * @param obj1 object to check equality of
 * @param obj2 object to check equality against
 * @returns true if `obj1` equals `obj2`
 */
export const areDeeplyEqual = function (obj1: any, obj2: any) {
  if (obj1 === obj2) return true; // Check strict equality for primitives and same object references

  if (obj1 === null || obj2 === null) return false; // If one is null, the other must be null (handled by ===)
  if (typeof obj1 !== "object" || typeof obj2 !== "object")
    return obj1 === obj2; // Check other primitive types

  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!areDeeplyEqual(obj1[i], obj2[i])) return false; // Recurse for each array element
    }
    return true;
  }

  if (Array.isArray(obj2)) return false; // If only one is an array, they are not equal

  // Handle object comparisons (order of keys doesn't matter for objects, but does for arrays)
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !areDeeplyEqual(obj1[key], obj2[key])) {
      return false; // Recurse for object property values
    }
  }

  return true;
};
