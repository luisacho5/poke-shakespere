interface TextFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function TextField({ value, onChange, placeholder = "Enter Pokemon name..." }: TextFieldProps) {
    return (
        <div className="w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
            />
        </div>
    );
}