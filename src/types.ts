export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    height: number;
    weight: number;
    abilities: string[];
    spriteUrl: string;
}