import { fetchPokemon } from "./api.js";
import { formatPokemonId } from "./utils.js";
import { fetchPokemonList } from "./api.js";

const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 151;

let currentPage: number = 1;
let isDarkMode: boolean = false;

console.log(`Carregando página ${currentPage}...`);

fetchPokemonList(currentPage, POKEMON_PER_PAGE).then((pokemons) => {
    console.log(`Sucesso! Carregados ${pokemons.length} Pokémons em paralelo:\n`);
    for (const p of pokemons) {
        console.log(`${formatPokemonId(p.id)} - ${p.name.toUpperCase()} [${p.types.join("/")}]`);
    }
});