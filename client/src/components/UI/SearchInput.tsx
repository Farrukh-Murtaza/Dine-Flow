import { Search } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
            />

            <input
                type="search"
                className="input pl-10"
                placeholder={placeholder}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        </div>
    );
}