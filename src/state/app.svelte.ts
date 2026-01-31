interface App {
  status: "loading" | "parsing" | "ready" | "error";
  errorMessage: string;
  title: string;
}

export const appState = $state<App>({
  errorMessage: "",
  status: "ready",
  title: "",
});
