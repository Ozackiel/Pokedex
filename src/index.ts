import type { Pokemon } from "./types.js";
import { fetchPokemon, fetchPokemonList } from "./api.js";
import { captalize } from "./utils.js";
import { formatPokemonId } from "./utils.js";

const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 1025;
const pokedexGrid = document.getElementById("pokedex-grid") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const loadMoreBtn = document.getElementById("load-more-btn") as HTMLButtonElement;
const pokemonModal = document.getElementById("pokemon-modal") as HTMLDivElement;
const modalCloseBtn = document.getElementById("modal-close-btn") as HTMLButtonElement;
const modalBody = document.getElementById("modal-body") as HTMLDivElement;
const modalOverlay = document.querySelector(".modal-overlay") as HTMLDivElement;

let currentPage: number = 1;
let allPokemons: Pokemon[] = [];
let isDarkMode: boolean = false;

if (!pokedexGrid) {
    throw new Error("Elemento #pokedex-grid não encontrado no HTML!");
}

function openPokemonModal(pokemon: Pokemon): void {
    if (!modalBody || !pokemonModal) return;

    const calcPercent = (val: number) => Math.min(100, Math.round((val / 255) * 100));

    modalBody.innerHTML = `
        <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
        <img src="${pokemon.spriteUrl}" alt="${pokemon.name}" style="width: 140px; height: 140px;">
        <h2 class="pokemon-name" style="font-size: 24px;">${captalize(pokemon.name)}</h2>
        <p style="margin-bottom: 16px; font-weight: bold;">${pokemon.types.join(" • ")}</p>

        <div class="pokemon-metrics">
            <div>
                <strong>Altura</strong>
                <p>${pokemon.height} m</p>
            </div>
            <div>
                <strong>Peso</strong>
                <p>${pokemon.weight} kg</p>
            </div>
        </div>

        <div class="pokemon-abilities">
            <strong>Habilidades:</strong>
            <p>${pokemon.abilities.join(", ")}</p>
        </div>

        <div class="stats-container">
            ${renderStatRow("HP", pokemon.hp, calcPercent(pokemon.hp), "#4caf50")}
            ${renderStatRow("Ataque", pokemon.attack, calcPercent(pokemon.attack), "#f44336")}
            ${renderStatRow("Defesa", pokemon.defense, calcPercent(pokemon.defense), "#2196f3")}
            ${renderStatRow("Atq. Especial", pokemon.specialAttack, calcPercent(pokemon.specialAttack), "#9c27b0")}
            ${renderStatRow("Def. Especial", pokemon.specialDefense, calcPercent(pokemon.specialDefense), "#3f51b5")}
            ${renderStatRow("Velocidade", pokemon.speed, calcPercent(pokemon.speed), "#ff9800")}
        </div>
    `;

    pokemonModal.classList.remove("hidden");
}

function renderStatRow(label: string, value: number, percent: number, color: string): string {
    return `
        <div class="stat-row">
            <div class="stat-label">
                <span>${label}</span>
                <span>${value} / 255</span>
            </div>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${percent}%; background-color: ${color};"></div>
            </div>
        </div>
    `;
}

function closePokemonModal(): void {
    if (!pokemonModal) return;
    pokemonModal.classList.add("hidden");
}

function renderPokemonCards(pokemon: Pokemon[]): void {
    if (!pokedexGrid) return;

    pokedexGrid.innerHTML = pokemon.map((pokemon) => `
    <div class="pokemon-card" data-id="${pokemon.id}">
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
        if (query === "") {
            renderPokemonCards(allPokemons);
            loadMoreBtn.style.display = "inline-block";
            return;
        }
        loadMoreBtn.style.display = "none";
        const filtered = allPokemons.filter((p) =>
            p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
        );
        if (filtered.length > 0) {
            renderPokemonCards(filtered);
        } else {
            pokedexGrid.innerHTML = `
            <p class="search-hint">
                Não encontrado na página atual. Pressione <strong>Enter</strong> para buscar na internet!
            </p>`;
        }
    });

    searchInput.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) return;

            loadMoreBtn.style.display = "none";
            pokedexGrid.innerHTML = `<p class="search-hint">Buscando na PokéAPI...</p>`;

            try {
                const pokemon = await fetchPokemon(query);
                if (!allPokemons.some(p => p.id === pokemon.id)) {
                    allPokemons.push(pokemon);
                }
                renderPokemonCards([pokemon]);
            } catch (error) {
                pokedexGrid.innerHTML = `
                <p class="search-error">
                    Pokémon "${query}" não encontrado na base de dados!
                </p>`;
            }
        }
    });
});

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    isDarkMode = !isDarkMode;
    themeToggleBtn.textContent = isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});

loadMoreBtn.addEventListener("click", async () => {
    currentPage++;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Carregando...";
    const novosPokemons = await fetchPokemonList(currentPage, POKEMON_PER_PAGE);
    allPokemons = [...allPokemons, ...novosPokemons];
    renderPokemonCards(allPokemons);
    if (allPokemons.length >= MAX_POKEMON_ID) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = `Todos os ${MAX_POKEMON_ID} Pokémons foram carregados!`;
    } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Carregar Mais";
    }
});

pokedexGrid.addEventListener("click", (event) => {
    const card = (event.target as HTMLElement).closest(".pokemon-card") as HTMLElement;
    if (!card) return;

    const clickedId = Number(card.dataset.id);
    const clickedPokemon = allPokemons.find((p) => p.id === clickedId);

    if (clickedPokemon) {
        openPokemonModal(clickedPokemon);
    }
});

modalCloseBtn.addEventListener("click", closePokemonModal);
modalOverlay.addEventListener("click", closePokemonModal);
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePokemonModal();
    }
});