import { captalize } from "./utils.js";
export const API_URL = "https://pokeapi.co/api/v2";
export async function fetchPokemon(id) {
    const search = typeof id === "string" ? id.toLowerCase() : id;
    const response = await fetch(`${API_URL}/pokemon/${search}`);
    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => captalize(type.type.name)),
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        spriteUrl: data.sprites.front_default,
    };
}
export async function fetchPokemonList(page, limit) {
    const startId = (page - 1) * limit + 1;
    const promises = [];
    for (let i = 0; i < limit; i++) {
        const pokemonId = startId + i;
        if (pokemonId > 151)
            break;
        promises.push(fetchPokemon(pokemonId));
    }
    return await Promise.all(promises);
}
//# sourceMappingURL=api.js.map