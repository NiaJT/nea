import { useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const MultiSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <div
            role="combobox"
            aria-expanded={open}
            tabIndex={0}
            className={cn(
              "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
              className,
            )}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {value.length === 0 && (
            <span className="px-1 text-gray-500">{placeholder}</span>
          )}
          {value.map((v) => (
            <span
              key={v}
              className="flex items-center gap-1.5 rounded bg-gray-100 px-2 py-1 text-sm text-slate-700"
            >
              {options.find((o) => o.value === v)?.label ?? v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                className="cursor-pointer text-slate-500 hover:text-slate-900"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(v);
                }}
              >
                <FiX className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        <FiChevronDown className="size-4 shrink-0 text-slate-700" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="max-h-64 w-(--anchor-width) overflow-y-auto p-1.5"
      >
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Checkbox
              checked={value.includes(o.value)}
              onCheckedChange={() => toggle(o.value)}
            />
            {o.label}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
