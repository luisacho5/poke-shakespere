import {GET} from '@/app/api/pokemon/route';
import {NextRequest} from 'next/server';

global.fetch = jest.fn();

describe('Pokemon API Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createMockRequest = (searchParams: Record<string, string>) => {
        const url = new URL('http://localhost:3000/api/pokemon');
        Object.entries(searchParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        return new NextRequest(url.toString());
    };

    describe('Input Validation', () => {
        it('should return 400 if no name is provided', async () => {
            const request = createMockRequest({});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Pokemon name is required');
        });
    });

    describe('Pokemon API Integration', () => {
        it('should return 404 if pokemon is not found', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            const request = createMockRequest({name: 'invalidpokemon'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.error).toBe('Pokemon not found');
            expect(fetch).toHaveBeenCalledWith(
                'https://pokeapi.co/api/v2/pokemon-species/invalidpokemon'
            );
        });

        it('should return 404 if no english description found', async () => {
            const mockPokemonData = {
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'Descripción en español',
                        language: {name: 'es'},
                    },
                    {
                        flavor_text: 'Description en français',
                        language: {name: 'fr'},
                    },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.error).toBe('No English description found');
        });
    });

    describe('Successful Pokemon Fetch', () => {
        it('should return pokemon data with shakespearean translation', async () => {
            const mockPokemonData = {
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'It stores\felectricity\nin its cheeks.',
                        language: {name: 'en'},
                    },
                    {
                        flavor_text: 'Other language entry',
                        language: {name: 'es'},
                    },
                ],
            };

            const mockShakespeareData = {
                contents: {
                    translated: 'It doth store electricity in its cheeks.',
                },
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockShakespeareData,
            });

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.name).toBe('pikachu');
            expect(data.description).toBe('It stores electricity in its cheeks.');
            expect(data.shakespeareanDescription).toBe('It doth store electricity in its cheeks.');
            expect(fetch).toHaveBeenCalledTimes(2);
        });

    });

    describe('Shakespeare API Fallback', () => {
        it('should fallback to original description if shakespeare API fails', async () => {
            const mockPokemonData = {
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'It stores electricity in its cheeks.',
                        language: {name: 'en'},
                    },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 429,
            });

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.shakespeareanDescription).toBe(data.description);
        });

        it('should fallback to original description if shakespeare API throws error', async () => {
            const mockPokemonData = {
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'It stores electricity in its cheeks.',
                        language: {name: 'en'},
                    },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.shakespeareanDescription).toBe(data.description);
        });

    });

    describe('Error Handling', () => {
        it('should return 500 if pokemon API throws unexpected error', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Failed to fetch Pokemon data');
        });

        it('should return 500 if Zod validation fails on pokemon data', async () => {
            const invalidPokemonData = {
                name: 'pikachu',
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => invalidPokemonData,
            });

            const request = createMockRequest({name: 'pikachu'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Failed to fetch Pokemon data');
        });
    });

    describe('Zod Schema Filtering', () => {
        it('should filter and return only english entries via Zod transform', async () => {
            const mockPokemonData = {
                name: 'bulbasaur',
                flavor_text_entries: [
                    {
                        flavor_text: 'Spanish description',
                        language: {name: 'es'},
                    },
                    {
                        flavor_text: 'A strange seed was planted on its back at birth.',
                        language: {name: 'en'},
                    },
                    {
                        flavor_text: 'French description',
                        language: {name: 'fr'},
                    },
                    {
                        flavor_text: 'Another English description',
                        language: {name: 'en'},
                    },
                ],
            };

            const mockShakespeareData = {
                contents: {
                    translated: 'A strange seed was planted on its back at birth, forsooth.',
                },
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPokemonData,
            });

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockShakespeareData,
            });

            const request = createMockRequest({name: 'bulbasaur'});
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.description).toBe('A strange seed was planted on its back at birth.');
        });
    });
});
