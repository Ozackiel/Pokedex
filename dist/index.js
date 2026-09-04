"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_URL = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE = 20;
const MAX_POKEMON_ID = 151;
let currentPage = 1;
let isDarkMode = false;
function formatPokemonId(id) {
    return `#${id.toString().padStart(4, "0")}`;
}
function filterPokemonByType(pokemonList, types) {
    if (types.length === 0) {
        return pokemonList;
    }
    return pokemonList.filter((pokemon) => types.some((type) => pokemon.types.includes(type)));
}
async function fetchPokemon(id) {
    const response = await fetch(`${API_URL}/pokemon/${id}`);
    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        spriteUrl: data.sprites.front_default,
    };
}
// Chamando a função assíncrona para buscar o Pokémon #1 (Bulbasaur) na internet
fetchPokemon(40).then((pokemon) => {
    console.log("Pokémon baixado com sucesso da PokéAPI:");
    console.log(`Nome: ${pokemon.name.toUpperCase()}`);
    console.log(`ID Formatado: ${formatPokemonId(pokemon.id)}`);
    console.log(`Tipos: ${pokemon.types.join(", ")}`);
    console.log(`HP: ${pokemon.hp} | Ataque: ${pokemon.attack}`);
    console.log(`Foto: ${pokemon.spriteUrl}`);
});
//# sourceMappingURL=index.js.map