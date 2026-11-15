import { useState } from "react";
import { format, parse } from "date-fns";
import { FiCalendar } from "react-icons/fi";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string; // yyyy-MM-dd
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  readOnly?: boolean;
  defaultMonth?: string;
  className?: string;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  disabled,
  readOnly = false,
  defaultMonth,
  className,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const initialMonth =
    selected ??
    (defaultMonth ? parse(defaultMonth, "yyyy-MM-dd", new Date()) : undefined);

  return (
    <Popover
      open={readOnly ? false : open}
      onOpenChange={(next) => !readOnly && setOpen(next)}
    >
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={readOnly}
            aria-disabled={readOnly}
            className={cn(
              "flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
              !selected && "text-gray-500",
              readOnly &&
                "cursor-not-allowed bg-gray-100 text-gray-500 opacity-70",
              className,
            )}
          />
        }
      >
        <span>{selected ? format(selected, "dd/MM/yyyy") : placeholder}</span>
        <FiCalendar
          className={cn("size-5 text-slate-800", readOnly && "text-gray-400")}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={initialMonth}
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={new Date(2050, 11)}
          disabled={disabled}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
