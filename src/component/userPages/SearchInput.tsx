import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) => (
  <div className={cn("relative w-full", className)}>
    <FiSearch
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 bg-white pl-10 text-sm placeholder:text-gray-400 border-gray-300 placeholder:text-xs rounded-[8px] focus-visible:border-border focus-visible:ring-0 focus-visible:outline-none aria-invalid:border-border aria-invalid:ring-0"
    />
  </div>
);

export default SearchInput;
