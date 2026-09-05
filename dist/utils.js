export function formatPokemonId(id) {
    return `#${id.toString().padStart(4, "0")}`;
}
export function capitalize(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
//# sourceMappingURL=utils.js.map