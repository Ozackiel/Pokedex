import type { Pokemon } from "./types.js";

export function formatPokemonId(id: number): string {
    return `#${id.toString().padStart(4, "0")}`;
}

export function filterPokemonByType(pokemonList: Pokemon[], types: string[]): Pokemon[] {
    if (types.length === 0) {
        return pokemonList;
    }
    return pokemonList.filter((pokemon) => types.some((type) => pokemon.types.includes(type)));
}

export function captalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}