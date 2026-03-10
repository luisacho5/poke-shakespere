'use client'

interface PokemonCardProps {
    name: string;
    description: string;
    shakespeareanDescription: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export default function PokemonCard({
                                        name,
                                        description,
                                        shakespeareanDescription,
                                        isFavorite,
                                        onToggleFavorite,
                                    }: PokemonCardProps) {
    return (
        <div className="w-full p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold capitalize text-gray-900">{name}</h2>
                <button
                    onClick={onToggleFavorite}
                    className="cursor-pointer hover:scale-110 transition-transform w-24"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Original Description:</h3>
                    <p className="text-gray-700">{description}</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Shakespearean Description:</h3>
                    <p className="text-gray-700 italic">{shakespeareanDescription}</p>
                </div>
            </div>
        </div>
    );
}