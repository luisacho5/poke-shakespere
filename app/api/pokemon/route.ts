import {NextRequest, NextResponse} from 'next/server';
import {PokemonSpeciesSchema, ShakespeareResponseSchema} from '@/lib/schemas';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({error: 'Pokemon name is required'}, {status: 400});
    }

    try {
        const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`
        );

        if (!pokemonResponse.ok) {
            return NextResponse.json({error: 'Pokemon not found'}, {status: 404});
        }

        const rawPokemonData = await pokemonResponse.json();
        const pokemonData = PokemonSpeciesSchema.parse(rawPokemonData);

        if (pokemonData.flavor_text_entries.length === 0) {
            return NextResponse.json({error: 'No English description found'}, {status: 404});
        }

        const description = pokemonData.flavor_text_entries[0].flavor_text
            .replace(/\f/g, ' ')
            .replace(/\n/g, ' ')
            .trim();
        
        let shakespeareanDescription = description;
        try {
            const shakespeareUrl = `https://api.funtranslations.com/translate/shakespeare.json?text=${encodeURIComponent(description)}`;
            const shakespeareResponse = await fetch(shakespeareUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (shakespeareResponse.ok) {
                const rawShakespeareData = await shakespeareResponse.json();
                const shakespeareData = ShakespeareResponseSchema.parse(rawShakespeareData);
                shakespeareanDescription = shakespeareData.contents.translated;
            } else {
                console.warn(`Shakespeare API failed with status ${shakespeareResponse.status}`);
            }
        } catch (error) {
            console.error('Shakespeare translation error:', error);
        }

        return NextResponse.json({
            name: name.toLowerCase(),
            description,
            shakespeareanDescription,
        });
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        return NextResponse.json(
            {error: 'Failed to fetch Pokemon data'},
            {status: 500}
        );
    }
}
