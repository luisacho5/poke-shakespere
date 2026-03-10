import {PokemonSpeciesSchema,} from '@/lib/schemas';

describe('Zod Schemas', () => {

    describe('PokemonSpeciesSchema', () => {
        it('should validate a valid pokemon species', () => {
            const validSpecies = {
                name: 'pikachu',
                flavor_text_entries: [
                    {
                        flavor_text: 'It stores electricity in its cheeks.',
                        language: {name: 'en'},
                    },
                ],
            };

            const result = PokemonSpeciesSchema.safeParse(validSpecies);
            expect(result.success).toBe(true);
        });

        it('should reject invalid pokemon species', () => {
            const invalidSpecies = {
                name: 'pikachu',
                // missing flavor_text_entries
            };

            const result = PokemonSpeciesSchema.safeParse(invalidSpecies);
            expect(result.success).toBe(false);
        });
    });
});
