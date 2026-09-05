export function formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, "0")}`;
}

export function capitalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}