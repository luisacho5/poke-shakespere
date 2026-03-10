import { getPokemonWithShakespeareanDescription } from '@/lib/api';

global.fetch = jest.fn();

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemonWithShakespeareanDescription', () => {
    it('should fetch and parse pokemon data successfully', async () => {
      const mockResponse = {
        name: 'pikachu',
        description: 'It stores electricity in its cheeks.',
        shakespeareanDescription: 'It doth store electricity in its cheeks.',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPokemonWithShakespeareanDescription('pikachu');

      expect(fetch).toHaveBeenCalledWith('/api/pokemon?name=pikachu');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API returns error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Pokemon not found' }),
      });

      await expect(getPokemonWithShakespeareanDescription('invalidpokemon')).rejects.toThrow(
        'Pokemon not found'
      );
    });

    it('should validate response with Zod', async () => {
      const invalidResponse = {
        name: 'pikachu',
        description: 'It stores electricity in its cheeks.',
        // missing shakespeareanDescription
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      });

      await expect(getPokemonWithShakespeareanDescription('pikachu')).rejects.toThrow();
    });
  });
});
