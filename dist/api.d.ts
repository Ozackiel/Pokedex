import type { Pokemon } from "./types.js";
export declare const API_URL: string;
export declare function fetchPokemon(id: number | string): Promise<Pokemon>;
export declare function fetchPokemonList(page: number, limit: number): Promise<Pokemon[]>;
//# sourceMappingURL=api.d.ts.map