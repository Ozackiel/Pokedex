import type { Pokemon } from "./types.js";
import {
    fetchPokemon,
    fetchAllPokemonNames,
    fetchPokemonsByType,
    type SimplePokemon
} from "./api.js";
import { capitalize, formatPokemonId } from "./utils.js";

// ==========================================
// CONSTANTES DE CONFIGURAÇÃO DO SISTEMA
// ==========================================
const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 1025;
const POKEMON_TYPES: string[] = [
    "Todos", "Normal", "Fire", "Water", "Grass", "Electric",
    "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic",
    "Bug", "Rock", "Ghost", "Dragon", "Steel", "Fairy"
];

// ==========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ==========================================
const pokedexGrid = document.getElementById("pokedex-grid") as HTMLDivElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const loadMoreBtn = document.getElementById("load-more-btn") as HTMLButtonElement;
const pokemonModal = document.getElementById("pokemon-modal") as HTMLDivElement;
const modalCloseBtn = document.getElementById("modal-close-btn") as HTMLButtonElement;
const modalBody = document.getElementById("modal-body") as HTMLDivElement;
const modalOverlay = document.querySelector(".modal-overlay") as HTMLDivElement;
const typeFilterContainer = document.getElementById("type-filter-container") as HTMLDivElement;

if (!pokedexGrid) {
    throw new Error("Elemento #pokedex-grid não encontrado no HTML!");
}

// ==========================================
// ESTADO REATIVO DA APLICAÇÃO (STATE MANAGEMENT)
// ==========================================
const selectedTypes = new Set<string>();
let allPokemonIndex: SimplePokemon[] = [];
let activeCatalog: SimplePokemon[] = [];
let displayedPokemons: Pokemon[] = [];
let visibleCount: number = POKEMON_PER_PAGE;
let isDarkMode: boolean = false;
let searchDebounceTimeout: number | undefined;

// ==========================================
// GERENCIAMENTO DE TEMA (DARK / LIGHT MODE)
// ==========================================
function applyTheme(dark: boolean): void {
    isDarkMode = dark;
    document.body.classList.toggle("dark-mode", isDarkMode);
    themeToggleBtn.textContent = isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro";
}

function initTheme(): void {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme !== null) {
        applyTheme(savedTheme === "dark");
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(event.matches);
        }
    });
}

initTheme();

// ==========================================
// RENDERIZAÇÃO DO MODAL DE DETALHES
// ==========================================
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

function openPokemonModal(pokemon: Pokemon): void {
    if (!modalBody || !pokemonModal) return;

    const calcPercent = (val: number) => Math.min(100, Math.round((val / 255) * 100));

    modalBody.innerHTML = `
        <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
        <img src="${pokemon.spriteUrl}" alt="${pokemon.name}" style="width: 140px; height: 140px;">
        <h2 class="pokemon-name" style="font-size: 24px;">${capitalize(pokemon.name)}</h2>
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

function closePokemonModal(): void {
    if (!pokemonModal) return;
    pokemonModal.classList.add("hidden");
}

// ==========================================
// RENDERIZAÇÃO DA GRADE E BOTÕES DE FILTRO
// ==========================================
function createPokemonCardHTML(pokemon: Pokemon): string {
    return `
        <div class="pokemon-card" data-id="${pokemon.id}">
            <span class="pokemon-id">${formatPokemonId(pokemon.id)}</span>
            <img src="${pokemon.spriteUrl}" alt="${pokemon.name}">
            <h3 class="pokemon-name">${capitalize(pokemon.name)}</h3>
            <p>${pokemon.types.join(" / ")}</p>
        </div>
    `;
}

function renderPokemonCards(pokemons: Pokemon[], append: boolean = false): void {
    if (!pokedexGrid) return;

    const cardsHTML = pokemons.map(createPokemonCardHTML).join("");
    if (append) {
        pokedexGrid.insertAdjacentHTML("beforeend", cardsHTML);
    } else {
        pokedexGrid.innerHTML = cardsHTML;
    }
}

function renderTypeFilters(): void {
    if (!typeFilterContainer) return;

    const isTodosActive = selectedTypes.size === 0;

    typeFilterContainer.innerHTML = POKEMON_TYPES.map((type) => {
        const isActive = type === "Todos" ? isTodosActive : selectedTypes.has(type);
        return `
            <button class="type-btn ${isActive ? "active" : ""}" data-type="${type}">
                ${type === "Todos" ? "🌐 Todos" : type}
            </button>
        `;
    }).join("");
}

// ==========================================
// PIPELINE CENTRAL DE FILTRAGEM E CARREGAMENTO (SSOT)
// ==========================================
async function updateCatalogAndRender(isLoadMore: boolean = false): Promise<void> {
    if (!isLoadMore) {
        pokedexGrid.innerHTML = `<p class="search-hint">Filtrando Pokédex...</p>`;
        loadMoreBtn.style.display = "none";
    }

    const query = searchInput.value.toLowerCase().trim();

    // 1. Resolução do Catálogo Ativo baseado nos tipos selecionados
    if (selectedTypes.size === 0) {
        activeCatalog = allPokemonIndex;
    } else {
        const typeLists = await Promise.all(
            Array.from(selectedTypes).map((type) => fetchPokemonsByType(type))
        );

        const uniqueMap = new Map<number, SimplePokemon>();
        for (const list of typeLists) {
            for (const item of list) {
                uniqueMap.set(item.id, item);
            }
        }

        activeCatalog = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
    }

    // 2. Filtragem por busca textual (nome ou ID)
    let filteredList = activeCatalog;
    if (query !== "") {
        filteredList = activeCatalog.filter(
            (p) => p.name.toLowerCase().includes(query) || p.id.toString() === query
        );
    }

    // 3. Caso nenhum Pokémon atenda aos critérios
    if (filteredList.length === 0) {
        pokedexGrid.innerHTML = `<p class="search-hint">Nenhum Pokémon encontrado com os filtros selecionados.</p>`;
        displayedPokemons = [];
        loadMoreBtn.style.display = "none";
        return;
    }

    // 4. Paginação incremental vs renderização completa
    if (isLoadMore) {
        const startIndex = displayedPokemons.length;
        const newItemsToDisplay = filteredList.slice(startIndex, visibleCount);
        const newPokemons = await Promise.all(newItemsToDisplay.map((item) => fetchPokemon(item.id)));
        displayedPokemons = [...displayedPokemons, ...newPokemons];
        renderPokemonCards(newPokemons, true);
    } else {
        const itemsToDisplay = filteredList.slice(0, visibleCount);
        displayedPokemons = await Promise.all(itemsToDisplay.map((item) => fetchPokemon(item.id)));
        renderPokemonCards(displayedPokemons, false);
    }

    // 5. Atualização do estado do botão Carregar Mais
    if (visibleCount >= filteredList.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "inline-block";
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Carregar Mais";
    }
}

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
async function init(): Promise<void> {
    try {
        renderTypeFilters();
        pokedexGrid.innerHTML = `<p class="search-hint">Carregando Pokédex...</p>`;

        allPokemonIndex = await fetchAllPokemonNames(MAX_POKEMON_ID);
        await updateCatalogAndRender();
    } catch (error) {
        pokedexGrid.innerHTML = `
            <p class="search-error">
                Erro ao carregar a Pokédex. Verifique sua conexão e recarregue a página.
            </p>
        `;
    }
}

init();

// ==========================================
// REGISTRO DE EVENTOS (EVENT LISTENERS)
// ==========================================

// Campo de busca com técnica de debounce (espera 300ms antes de disparar)
searchInput.addEventListener("input", () => {
    window.clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = window.setTimeout(() => {
        visibleCount = POKEMON_PER_PAGE;
        updateCatalogAndRender();
    }, 300);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        window.clearTimeout(searchDebounceTimeout);
        visibleCount = POKEMON_PER_PAGE;
        updateCatalogAndRender();
    }
});

// Botão "Carregar Mais" incrementa a contagem e anexa a próxima fatia sem resetar o scroll
loadMoreBtn.addEventListener("click", async () => {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Carregando...";
    visibleCount += POKEMON_PER_PAGE;
    await updateCatalogAndRender(true);
});

// Delegação de eventos no grid de pokémons para abertura da modal
pokedexGrid.addEventListener("click", (event) => {
    const card = (event.target as HTMLElement).closest(".pokemon-card") as HTMLElement | null;
    if (!card) return;

    const clickedId = Number(card.dataset.id);
    const clickedPokemon = displayedPokemons.find((p) => p.id === clickedId);

    if (clickedPokemon) {
        openPokemonModal(clickedPokemon);
    }
});

// Alternância de tema claro/escuro
themeToggleBtn.addEventListener("click", () => {
    applyTheme(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Fechamento da modal
modalCloseBtn.addEventListener("click", closePokemonModal);
modalOverlay.addEventListener("click", closePokemonModal);
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePokemonModal();
    }
});

// Filtros por Tipo (seleção múltipla com Set)
typeFilterContainer.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest(".type-btn") as HTMLButtonElement | null;
    if (!button) return;

    const clickedType = button.dataset.type ?? "Todos";

    if (clickedType === "Todos") {
        selectedTypes.clear();
    } else {
        if (selectedTypes.has(clickedType)) {
            selectedTypes.delete(clickedType);
        } else {
            selectedTypes.add(clickedType);
        }
    }

    renderTypeFilters();
    visibleCount = POKEMON_PER_PAGE;
    await updateCatalogAndRender();
});