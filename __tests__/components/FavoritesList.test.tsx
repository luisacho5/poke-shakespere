import { render, screen, fireEvent } from '@testing-library/react';
import FavoritesList from '@/components/FavoritesList';
import { FavoritePokemon } from '@/lib/favorites';

describe('FavoritesList', () => {
  const mockFavorites: FavoritePokemon[] = [
    {
      name: 'pikachu',
      description: 'Electric mouse',
      shakespeareanDescription: 'Electric mouse, forsooth',
      addedAt: 123456,
    },
    {
      name: 'charizard',
      description: 'Fire dragon',
      shakespeareanDescription: 'Fire dragon, forsooth',
      addedAt: 123457,
    },
  ];

  it('should show message when no favorites', () => {
    render(<FavoritesList favorites={[]} onRemove={jest.fn()} onSelect={jest.fn()} />);
    expect(screen.getByText('No favorites yet. Add some Pokemon!')).toBeInTheDocument();
  });

  it('should render list of favorites', () => {
    render(<FavoritesList favorites={mockFavorites} onRemove={jest.fn()} onSelect={jest.fn()} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('charizard')).toBeInTheDocument();
  });

  it('should show "Your Favorites" heading when favorites exist', () => {
    render(<FavoritesList favorites={mockFavorites} onRemove={jest.fn()} onSelect={jest.fn()} />);
    expect(screen.getByText('Your Favorites')).toBeInTheDocument();
  });

  it('should call onSelect when favorite is clicked', () => {
    const handleSelect = jest.fn();
    render(<FavoritesList favorites={mockFavorites} onRemove={jest.fn()} onSelect={handleSelect} />);

    const pikachuButton = screen.getByText('pikachu');
    fireEvent.click(pikachuButton);

    expect(handleSelect).toHaveBeenCalledWith(mockFavorites[0]);
  });

  it('should call onRemove when remove button is clicked', () => {
    const handleRemove = jest.fn();
    render(<FavoritesList favorites={mockFavorites} onRemove={handleRemove} onSelect={jest.fn()} />);

    const removeButtons = screen.getAllByTitle('Remove from favorites');
    fireEvent.click(removeButtons[0]);

    expect(handleRemove).toHaveBeenCalledWith('pikachu');
  });

  it('should render remove button for each favorite', () => {
    render(<FavoritesList favorites={mockFavorites} onRemove={jest.fn()} onSelect={jest.fn()} />);
    const removeButtons = screen.getAllByTitle('Remove from favorites');
    expect(removeButtons).toHaveLength(2);
  });
});
