const API_URL: string = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE: number = 20;
const MAX_POKEMON_ID: number = 151;

let currentPage: number = 1;
let isDarkMode: boolean = false;

interface Pokemon {
    id: number;
    name: string;
    types: string[];
    hp: number;
    attack: number;
    spriteUrl: string;
}

const bulbasaur: Pokemon = {
    id: 1,
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    hp: 45,
    attack: 49,
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
}

console.log(bulbasaur.name.toUpperCase());
console.log(bulbasaur.types);
console.log(bulbasaur.attack);
console.log(bulbasaur.spriteUrl);