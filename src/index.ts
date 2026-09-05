import type { Pokemon } from "./types.js";
import { fetchPokemonList } from "./api.js";
import { captalize } from "./utils.js";
import { formatPokemonId } from "./utils.js";

const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 151;
const pokedexGrid = document.getElementById("pokedex-grid") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;

let currentPage: number = 1;
let allPokemons: Pokemon[] = [];
let isDarkMode: boolean = false;

if (!pokedexGrid) {
    throw new Error("Elemento #pokedex-grid não encontrado no HTML!");
}

function renderPokemonCards(pokemon: Pokemon[]): void {
    if (!pokedexGrid) return;

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