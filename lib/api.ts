import {type PokemonData, PokemonDataSchema} from './schemas';

export type {PokemonData};

/**
 * Gets Pokemon data with Shakespearean description
 * Uses our Next.js API route to avoid CORS issues
 */
export async function getPokemonWithShakespeareanDescription(
    pokemonName: string
): Promise<PokemonData> {
    const response = await fetch(`/api/pokemon?name=${encodeURIComponent(pokemonName)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch Pokemon');
    }
    const rawData = await response.json();
    return PokemonDataSchema.parse(rawData);
}