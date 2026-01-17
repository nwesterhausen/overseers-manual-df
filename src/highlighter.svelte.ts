import { createHighlighterCore, createJavaScriptRegexEngine } from "shiki";

const highlighterPromise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/catppuccin-latte"),
    import("@shikijs/themes/catppuccin-macchiato"),
  ],
  langs: [import("@shikijs/langs/json")],
  engine: createJavaScriptRegexEngine(),
});

/**
 * Highlights code using the provided theme state (matches `themeState.mode`)
 *
 * @param code The stringified JSON to display
 * @param theme Pass in `themeState.mode` here, or specify manually. Defaults to 'dark'.
 *
 * @returns HTML to render, which will be color highlighted JSON
 */
export async function highlightJson(
  code: string,
  theme: "dark" | "light" = "dark",
) {
  const highlighter = await highlighterPromise;

  const highlightTheme =
    theme === "dark" ? "catppuccin-macchiato" : "catppuccin-latte";

  return highlighter.codeToHtml(code, {
    theme: highlightTheme,
    lang: "json",
  });
}
