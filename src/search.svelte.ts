// All the details for search to be available globally.
// Includes the term and any filtering applied.
export const searchState = $state({
    term: "",
    rawTypes: [],
    locations: [],
    requiredFlagTokens: [],
    requiredTokenValues: [],
    tokenValueMinimums: [],
    tokenValueMaximums: [],
});
