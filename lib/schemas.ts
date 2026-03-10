import {z} from 'zod';

export const FlavorTextEntrySchema = z.object({
    flavor_text: z.string(),
    language: z.object({
        name: z.string(),
    }),
});

export const PokemonSpeciesSchema = z.object({
    name: z.string(),
    flavor_text_entries: z.array(FlavorTextEntrySchema),
}).transform((data) => {
    const englishEntries = data.flavor_text_entries.filter(
        (entry) => entry.language.name === 'en'
    );
    return {
        name: data.name,
        flavor_text_entries: englishEntries,
    };
});
export const ShakespeareResponseSchema = z.object({
    contents: z.object({
        translated: z.string(),
    }),
});

export const PokemonDataSchema = z.object({
    name: z.string(),
    description: z.string(),
    shakespeareanDescription: z.string(),
});

export type PokemonData = z.infer<typeof PokemonDataSchema>;