'use client'

import {FavoritePokemon} from '@/lib/favorites';

interface FavoritesListProps {
    favorites: FavoritePokemon[];
    onRemove: (name: string) => void;
    onSelect: (pokemon: FavoritePokemon) => void;
}

export default function FavoritesList({favorites, onRemove, onSelect}: FavoritesListProps) {
    if (favorites.length === 0) {
        return (
            <div className="w-full p-6 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-center">No favorites yet. Add some Pokemon!</p>
            </div>
        );
    }
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Favorites</h2>
            <div className="space-y-2">
                {favorites.map((pokemon) => (
                    <div
                        key={pokemon.name}
                        className="flex cursor-pointer items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                        <button
                            onClick={() => onSelect(pokemon)}
                            className="flex-1 cursor-pointer text-left capitalize font-medium text-gray-900 hover:text-blue-600"
                        >
                            {pokemon.name}
                        </button>
                        <button
                            onClick={() => onRemove(pokemon.name)}
                            className="ml-4 text-red-500 hover:text-red-700 text-xl cursor-pointer"
                            title="Remove from favorites"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}