/**
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 *
 * Modified 2022 Nick Westerhausen
 *
 * @param elem - The element to check
 * @returns A set of booleans for each side of the element
 */
export const isOutOfViewport = function (elem: HTMLElement): ElemViewportBounding {
  // Get element's bounding
  const bounding: DOMRect = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  const out = {
    top: bounding.top < 0,
    left: bounding.left < 0,
    bottom: bounding.bottom > (window.innerHeight || document.documentElement.clientHeight),
    right: bounding.right > (window.innerWidth || document.documentElement.clientWidth),
    any: false,
    all: false,
  };
  out.any = out.top || out.left || out.bottom || out.right;
  out.all = out.top && out.left && out.bottom && out.right;

  return out;
};

export type ElemViewportBounding = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
  any: boolean;
  all: boolean;
};
