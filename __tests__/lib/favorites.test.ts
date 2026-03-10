import {addFavorite, getFavorites, isFavorite, removeFavorite} from '@/lib/favorites';

describe('Favorites Management', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('getFavorites', () => {
        it('should return empty array when no favorites exist', () => {
            const result = getFavorites();
            expect(result).toEqual([]);
        });

        it('should return parsed favorites from localStorage', () => {
            const mockFavorites = [
                {
                    name: 'pikachu',
                    description: 'Electric mouse',
                    shakespeareanDescription: 'Electric mouse, forsooth',
                    addedAt: 123456
                },
            ];
            localStorage.setItem('pokemon-favorites', JSON.stringify(mockFavorites));
            const result = getFavorites();
            expect(result).toEqual(mockFavorites);
        });
    });

    describe('addFavorite', () => {
        it('should add a new favorite to localStorage', () => {
            const pokemon = {
                name: 'pikachu',
                description: 'Electric mouse',
                shakespeareanDescription: 'Electric mouse, forsooth',
            };

            addFavorite(pokemon);

            const savedFavorites = getFavorites();
            expect(savedFavorites).toHaveLength(1);
            expect(savedFavorites[0].name).toBe('pikachu');
            expect(savedFavorites[0]).toHaveProperty('addedAt');
        });

        it('should not add duplicate favorites', () => {
            const existingFavorites = [
                {
                    name: 'pikachu',
                    description: 'Electric mouse',
                    shakespeareanDescription: 'Electric mouse, forsooth',
                    addedAt: 123456
                },
            ];
            localStorage.setItem('pokemon-favorites', JSON.stringify(existingFavorites));

            const pokemon = {
                name: 'Pikachu',
                description: 'Electric mouse',
                shakespeareanDescription: 'Electric mouse, forsooth',
            };

            addFavorite(pokemon);

            const savedFavorites = getFavorites();
            expect(savedFavorites).toHaveLength(1);
        });
    });

    describe('removeFavorite', () => {
        it('should remove a favorite from localStorage', () => {
            const existingFavorites = [
                {
                    name: 'pikachu',
                    description: 'Electric mouse',
                    shakespeareanDescription: 'Electric mouse, forsooth',
                    addedAt: 123456
                },
                {
                    name: 'charizard',
                    description: 'Fire dragon',
                    shakespeareanDescription: 'Fire dragon, forsooth',
                    addedAt: 123457
                },
            ];
            localStorage.setItem('pokemon-favorites', JSON.stringify(existingFavorites));

            removeFavorite('pikachu');

            const savedFavorites = getFavorites();
            expect(savedFavorites).toHaveLength(1);
            expect(savedFavorites[0].name).toBe('charizard');
        });

    });

    describe('isFavorite', () => {
        it('should return true if pokemon is in favorites', () => {
            const existingFavorites = [
                {
                    name: 'pikachu',
                    description: 'Electric mouse',
                    shakespeareanDescription: 'Electric mouse, forsooth',
                    addedAt: 123456
                },
            ];
            localStorage.setItem('pokemon-favorites', JSON.stringify(existingFavorites));

            expect(isFavorite('pikachu')).toBe(true);
        });

        it('should return false if pokemon is not in favorites', () => {
            expect(isFavorite('pikachu')).toBe(false);
        });
    });
});
