import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}
export const ALL_VALUE = "all";

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  allLabel?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

const FilterSelect = ({
  value,
  onChange,
  options,
  allLabel,
  placeholder,
  emptyMessage,
  disabled,
  className,
  contentClassName,
}: FilterSelectProps) => {
  const items = allLabel
    ? [{ label: allLabel, value: ALL_VALUE }, ...options]
    : options;

  const showEmpty = options.length === 0 && Boolean(emptyMessage);
  return (
    <Select
      value={value === "" ? null : value}
      items={items}
      disabled={disabled}
      onValueChange={(v) => onChange(v ?? (allLabel ? ALL_VALUE : ""))}
    >
      <SelectTrigger
        className={cn(
          "h-9! w-full rounded-[8px] border-gray-300 bg-gray-200 text-sm font-normal",
          className,
        )}
      >
        <SelectValue placeholder={placeholder ?? allLabel} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "w-max min-w-(--anchor-width) max-w-90",
          contentClassName,
        )}
      >
        {showEmpty ? (
          <div className="px-3 py-2 text-sm text-gray-500">{emptyMessage}</div>
        ) : (
          items.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="whitespace-nowrap"
            >
              {opt.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default FilterSelect;
