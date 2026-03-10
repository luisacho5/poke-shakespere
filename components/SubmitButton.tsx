'use client'

interface SubmitButtonProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export const SubmitButton = ({onClick, disabled = false, loading = false}: SubmitButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
        >
            {loading ? 'Loading...' : 'Submit'}
        </button>
    );
}