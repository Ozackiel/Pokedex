const API_URL: string = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 151;

let currentPage: number = 1;
let isDarkMode: boolean = false;

console.log(`[Configuração Pokédex] API: ${API_URL} | Página: ${currentPage}`)