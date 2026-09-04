import { fetchPokemon } from "./api.js";
import { formatPokemonId } from "./utils.js";
import { fetchPokemonList } from "./api.js";
const POKEMON_PER_PAGE = 20;
const MAX_POKEMON_ID = 151;
let currentPage = 1;
let isDarkMode = false;
console.log(`Carregando página ${currentPage}...`);
fetchPokemonList(currentPage, POKEMON_PER_PAGE).then((pokemons) => {
    console.log(`Sucesso! Carregados ${pokemons.length} Pokémons em paralelo:\n`);
    for (const p of pokemons) {
        console.log(`${formatPokemonId(p.id)} - ${p.name.toUpperCase()} [${p.types.join("/")}]`);
    }
});
//# sourceMappingURL=index.js.map