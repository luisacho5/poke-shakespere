export interface FavoritePokemon {
    name: string;
    description: string;
    shakespeareanDescription: string;
    addedAt: number;
}

const FAVORITES_KEY = 'pokemon-favorites';

export function getFavorites(): FavoritePokemon[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function addFavorite(pokemon: Omit<FavoritePokemon, 'addedAt'>): void {
    const favorites = getFavorites();

    if (favorites.some(fav => fav.name.toLowerCase() === pokemon.name.toLowerCase())) {
        return;
    }

    const newFavorite: FavoritePokemon = {
        ...pokemon,
        addedAt: Date.now(),
    };

    favorites.push(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function removeFavorite(pokemonName: string): void {
    const favorites = getFavorites();
    const filtered = favorites.filter(
        fav => fav.name.toLowerCase() !== pokemonName.toLowerCase()
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(pokemonName: string): boolean {
    const favorites = getFavorites();
    return favorites.some(fav => fav.name.toLowerCase() === pokemonName.toLowerCase());
}