interface Theme {
  mode: "light" | "dark";
  darkTheme: string;
  lightTheme: string;
}

export const themeState = $state<Theme>({
  mode: "dark",
  darkTheme: "macchiato",
  lightTheme: "latte",
});

export function toggleTheme() {
  themeState.mode = themeState.mode === "dark" ? "light" : "dark";
}
