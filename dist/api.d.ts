import type { Pokemon } from "./types.js";
export interface SimplePokemon {
    id: number;
    name: string;
}
export declare function fetchPokemon(id: number | string): Promise<Pokemon>;
export declare function fetchAllPokemonNames(limit?: number): Promise<SimplePokemon[]>;
export declare function fetchPokemonsByType(typeName: string): Promise<SimplePokemon[]>;
//# sourceMappingURL=api.d.ts.map