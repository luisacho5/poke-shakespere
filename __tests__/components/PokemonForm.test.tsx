import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PokemonForm from '@/components/PokemonForm';
import * as api from '@/lib/api';
import * as favorites from '@/lib/favorites';

// Mock the modules
jest.mock('@/lib/api');
jest.mock('@/lib/favorites');

describe('PokemonForm', () => {
  const mockPokemonData = {
    name: 'pikachu',
    description: 'It stores electricity in its cheeks.',
    shakespeareanDescription: 'It doth store electricity in its cheeks.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (favorites.getFavorites as jest.Mock).mockReturnValue([]);
    (favorites.isFavorite as jest.Mock).mockReturnValue(false);
  });

  it('should render search form', () => {
    render(<PokemonForm />);
    expect(screen.getByPlaceholderText(/Enter Pokemon name/i)).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should show error when submitting empty form', async () => {
    render(<PokemonForm />);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a Pokemon name')).toBeInTheDocument();
    });
  });

  it('should fetch and display pokemon when form is submitted', async () => {
    (api.getPokemonWithShakespeareanDescription as jest.Mock).mockResolvedValue(mockPokemonData);

    render(<PokemonForm />);

    const input = screen.getByPlaceholderText(/Enter Pokemon name/i);
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
      expect(screen.getByText('It stores electricity in its cheeks.')).toBeInTheDocument();
      expect(screen.getByText('It doth store electricity in its cheeks.')).toBeInTheDocument();
    });

    expect(api.getPokemonWithShakespeareanDescription).toHaveBeenCalledWith('pikachu');
  });

  it('should show loading state while fetching', async () => {
    (api.getPokemonWithShakespeareanDescription as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockPokemonData), 100))
    );

    render(<PokemonForm />);

    const input = screen.getByPlaceholderText(/Enter Pokemon name/i);
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('should show error message when fetch fails', async () => {
    (api.getPokemonWithShakespeareanDescription as jest.Mock).mockRejectedValue(
      new Error('Pokemon not found')
    );

    render(<PokemonForm />);

    const input = screen.getByPlaceholderText(/Enter Pokemon name/i);
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'invalidpokemon' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('should add pokemon to favorites when heart is clicked', async () => {
    (api.getPokemonWithShakespeareanDescription as jest.Mock).mockResolvedValue(mockPokemonData);
    (favorites.isFavorite as jest.Mock).mockReturnValue(false);

    render(<PokemonForm />);

    const input = screen.getByPlaceholderText(/Enter Pokemon name/i);
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByTitle('Add to favorites');
    fireEvent.click(favoriteButton);

    expect(favorites.addFavorite).toHaveBeenCalledWith({
      name: 'pikachu',
      description: 'It stores electricity in its cheeks.',
      shakespeareanDescription: 'It doth store electricity in its cheeks.',
    });
  });

  it('should remove pokemon from favorites when already favorited', async () => {
    (api.getPokemonWithShakespeareanDescription as jest.Mock).mockResolvedValue(mockPokemonData);
    (favorites.isFavorite as jest.Mock).mockReturnValue(true);

    render(<PokemonForm />);

    const input = screen.getByPlaceholderText(/Enter Pokemon name/i);
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByTitle('Remove from favorites');
    fireEvent.click(favoriteButton);

    expect(favorites.removeFavorite).toHaveBeenCalledWith('pikachu');
  });

  it('should display favorites list', () => {
    const mockFavorites = [
      {
        name: 'charizard',
        description: 'Fire dragon',
        shakespeareanDescription: 'Fire dragon, forsooth',
        addedAt: 123456,
      },
    ];
    (favorites.getFavorites as jest.Mock).mockReturnValue(mockFavorites);

    render(<PokemonForm />);

    expect(screen.getByText('Your Favorites')).toBeInTheDocument();
    expect(screen.getByText('charizard')).toBeInTheDocument();
  });
});
