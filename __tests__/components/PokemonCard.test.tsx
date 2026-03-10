import {fireEvent, render, screen} from '@testing-library/react';
import PokemonCard from '@/components/PokemonCard';

describe('PokemonCard', () => {
    const mockProps = {
        name: 'pikachu',
        description: 'It stores electricity in its cheeks.',
        shakespeareanDescription: 'It doth store electricity in its cheeks.',
        isFavorite: false,
        onToggleFavorite: jest.fn(),
    };

    it('should render pokemon name', () => {
        render(<PokemonCard {...mockProps} />);
        expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    it('should render both descriptions', () => {
        render(<PokemonCard {...mockProps} />);
        expect(screen.getByText('It stores electricity in its cheeks.')).toBeInTheDocument();
        expect(screen.getByText('It doth store electricity in its cheeks.')).toBeInTheDocument();
    });

    it('should show heart icon when not favorite', () => {
        render(<PokemonCard {...mockProps} isFavorite={false}/>);
        const button = screen.getByTitle('Add to favorites');
        expect(button).toHaveTextContent('🤍');
    });

    it('should show filled heart icon when favorite', () => {
        render(<PokemonCard {...mockProps} isFavorite={true}/>);
        const button = screen.getByTitle('Remove from favorites');
        expect(button).toHaveTextContent('❤️');
    });

    it('should call onToggleFavorite when heart button clicked', () => {
        const handleToggle = jest.fn();
        render(<PokemonCard {...mockProps} onToggleFavorite={handleToggle}/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleToggle).toHaveBeenCalledTimes(1);
    });
});
