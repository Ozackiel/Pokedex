"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_URL = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE = 20;
const MAX_POKEMON_ID = 151;
let currentPage = 1;
let isDarkMode = false;
const bulbasaur = {
    id: 1,
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    hp: 45,
    attack: 49,
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
};
console.log(bulbasaur.name.toUpperCase());
console.log(bulbasaur.types);
console.log(bulbasaur.attack);
console.log(bulbasaur.spriteUrl);
//# sourceMappingURL=index.js.map