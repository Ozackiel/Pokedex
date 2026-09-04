export function formatPokemonId(id) {
    return `#${id.toString().padStart(4, "0")}`;
}
export function filterPokemonByType(pokemonList, types) {
    if (types.length === 0) {
        return pokemonList;
    }
    return pokemonList.filter((pokemon) => types.some((type) => pokemon.types.includes(type)));
}
export function captalize(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
//# sourceMappingURL=utils.js.map