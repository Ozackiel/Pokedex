import { fetchPokemonList } from "./api.js";
import { captalize } from "./utils.js";
import { formatPokemonId } from "./utils.js";
const POKEMON_PER_PAGE = 20;
const MAX_POKEMON_ID = 151;
const pokedexGrid = document.getElementById("pokedex-grid");
const searchInput = document.getElementById("search-input");
const themeToggleBtn = document.getElementById("theme-toggle");
let currentPage = 1;
let allPokemons = [];
let isDarkMode = false;
if (!pokedexGrid) {
    throw new Error("Elemento #pokedex-grid não encontrado no HTML!");
}
function renderPokemonCards(pokemon) {
    if (!pokedexGrid)
        return;
    pokedexGrid.innerHTML = pokemon.map((pokemon) => `
    <div class="pokemon-card">
        <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
        <img src="${pokemon.spriteUrl}" alt="${pokemon.name}">
        <h3 class="pokemon-name">${captalize(pokemon.name)}</h3>
        <p>${pokemon.types.join(" / ")}</p>
    </div>
    `).join("");
}
fetchPokemonList(currentPage, POKEMON_PER_PAGE).then((pokemons) => {
    allPokemons = pokemons;
    renderPokemonCards(allPokemons);
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredPokemons = allPokemons.filter((pokemon) => {
            const matchesName = pokemon.name.toLowerCase().includes(query);
            const matchesId = pokemon.id.toString().includes(query);
            return matchesName || matchesId;
        });
        renderPokemonCards(filteredPokemons);
    });
});
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    themeToggleBtn.textContent = isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});
//# sourceMappingURL=index.js.map