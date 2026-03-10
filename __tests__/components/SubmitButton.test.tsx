import {fireEvent, render, screen} from '@testing-library/react';
import {SubmitButton} from '@/components/SubmitButton';

describe('SubmitButton', () => {
    it('should render with text "Submit"', () => {
        render(<SubmitButton onClick={jest.fn()}/>);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<SubmitButton onClick={handleClick}/>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<SubmitButton onClick={jest.fn()} disabled={true}/>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should show "Loading..." when loading prop is true', () => {
        render(<SubmitButton onClick={jest.fn()} loading={true}/>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
        render(<SubmitButton onClick={jest.fn()} loading={true}/>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
