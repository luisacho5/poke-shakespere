import { render, screen, fireEvent } from '@testing-library/react';
import TextField from '@/components/TextField';

describe('TextField', () => {
  it('should render with placeholder', () => {
    render(<TextField value="" onChange={jest.fn()} placeholder="Test placeholder" />);
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should display the value prop', () => {
    render(<TextField value="pikachu" onChange={jest.fn()} />);
    const input = screen.getByDisplayValue('pikachu');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when typing', () => {
    const handleChange = jest.fn();
    render(<TextField value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'charizard' } });

    expect(handleChange).toHaveBeenCalledWith('charizard');
  });

  it('should use default placeholder if not provided', () => {
    render(<TextField value="" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText('Enter Pokemon name...');
    expect(input).toBeInTheDocument();
  });
});
