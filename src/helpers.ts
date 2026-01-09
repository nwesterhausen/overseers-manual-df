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
