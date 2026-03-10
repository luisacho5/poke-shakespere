'use client'

import {useEffect, useState} from 'react';
import TextField from '@/components/TextField';
import {SubmitButton} from '@/components/SubmitButton';
import PokemonCard from '@/components/PokemonCard';
import FavoritesList from '@/components/FavoritesList';
import {getPokemonWithShakespeareanDescription, PokemonData} from '@/lib/api';
import {addFavorite, FavoritePokemon, getFavorites, isFavorite, removeFavorite,} from '@/lib/favorites';

export default function PokemonForm() {
    const [pokemonName, setPokemonName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPokemon, setCurrentPokemon] = useState<PokemonData | null>(null);
    const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleSubmit = async () => {
        if (!pokemonName.trim()) {
            setError('Please enter a Pokemon name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getPokemonWithShakespeareanDescription(pokemonName);
            setCurrentPokemon(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
            setCurrentPokemon(null);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (!currentPokemon) return;

        if (isFavorite(currentPokemon.name)) {
            removeFavorite(currentPokemon.name);
        } else {
            addFavorite({
                name: currentPokemon.name,
                description: currentPokemon.description,
                shakespeareanDescription: currentPokemon.shakespeareanDescription,
            });
        }

        setFavorites(getFavorites());
    };

    const handleRemoveFavorite = (name: string) => {
        removeFavorite(name);
        setFavorites(getFavorites());
    };

    const handleSelectFavorite = (pokemon: FavoritePokemon) => {
        setCurrentPokemon({
            name: pokemon.name,
            description: pokemon.description,
            shakespeareanDescription: pokemon.shakespeareanDescription,
        });
        setPokemonName(pokemon.name);
    };

    return (
        <div className="w-full space-y-8">
            <form className="flex flex-row gap-4 items-start" onSubmit={handleSubmit}>
                <TextField
                    value={pokemonName}
                    onChange={setPokemonName}
                    placeholder="Enter Pokemon name (e.g., pikachu)"
                />
                <SubmitButton onClick={handleSubmit} loading={loading} disabled={loading}/>
            </form>

            {error && (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {currentPokemon && (
                <PokemonCard
                    name={currentPokemon.name}
                    description={currentPokemon.description}
                    shakespeareanDescription={currentPokemon.shakespeareanDescription}
                    isFavorite={isFavorite(currentPokemon.name)}
                    onToggleFavorite={handleToggleFavorite}
                />
            )}
            <FavoritesList
                favorites={favorites}
                onRemove={handleRemoveFavorite}
                onSelect={handleSelectFavorite}
            />
        </div>
    );
}
