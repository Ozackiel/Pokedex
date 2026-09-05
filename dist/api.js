import { capitalize } from "./utils.js";
const pokemonCache = new Map();
const typeListCache = new Map();
const API_URL = "https://pokeapi.co/api/v2";
export async function fetchPokemon(id) {
    const search = typeof id === "string" ? id.toLowerCase() : id;
    if (pokemonCache.has(search)) {
        return pokemonCache.get(search);
    }
    const response = await fetch(`${API_URL}/pokemon/${search}`);
    if (!response.ok) {
        throw new Error(`Pokémon "${id}" não encontrado.`);
    }
    const data = await response.json();
    const pokemon = {
        id: data.id,
        name: data.name,
        types: data.types.map((item) => capitalize(item.type.name)),
        hp: data.stats[0]?.base_stat ?? 0,
        attack: data.stats[1]?.base_stat ?? 0,
        defense: data.stats[2]?.base_stat ?? 0,
        specialAttack: data.stats[3]?.base_stat ?? 0,
        specialDefense: data.stats[4]?.base_stat ?? 0,
        speed: data.stats[5]?.base_stat ?? 0,
        height: data.height / 10,
        weight: data.weight / 10,
        abilities: data.abilities.map((item) => capitalize(item.ability.name)),
        spriteUrl: data.sprites.front_default ?? "",
    };
    pokemonCache.set(data.id, pokemon);
    pokemonCache.set(data.name.toLowerCase(), pokemon);
    return pokemon;
}
export async function fetchAllPokemonNames(limit = 1025) {
    const response = await fetch(`${API_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
        throw new Error("Erro ao carregar o catálogo de Pokémons.");
    }
    const data = await response.json();
    return data.results.map((item) => {
        const segments = item.url.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] ?? "0";
        return {
            id: Number(lastSegment),
            name: item.name,
        };
    });
}
export async function fetchPokemonsByType(typeName) {
    const typeLower = typeName.toLowerCase();
    if (typeListCache.has(typeLower)) {
        return typeListCache.get(typeLower);
    }
    const response = await fetch(`${API_URL}/type/${typeLower}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar Pokémons do tipo ${typeName}`);
    }
    const data = await response.json();
    const pokemons = data.pokemon
        .map((p) => {
        const parts = p.pokemon.url.split("/").filter(Boolean);
        const id = Number(parts[parts.length - 1] ?? "0");
        return { id, name: p.pokemon.name };
    })
        .filter((p) => p.id <= 1025)
        .sort((a, b) => a.id - b.id);
    typeListCache.set(typeLower, pokemons);
    return pokemons;
}
//# sourceMappingURL=api.js.map