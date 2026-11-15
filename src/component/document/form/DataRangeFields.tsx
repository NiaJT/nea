import FormField from "@/component/userPages/FormField";
import DatePicker from "@/component/common/DatePicker";

interface DateRangeFieldsProps {
  fromLabel: string;
  fromValue: Date | undefined;
  onFromChange: (d: Date | undefined) => void;
  toLabel: string;
  toValue: Date | undefined;
  onToChange: (d: Date | undefined) => void;
}

export const DateRangeFields = ({
  fromLabel,
  fromValue,
  onFromChange,
  toLabel,
  toValue,
  onToChange,
}: DateRangeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label={fromLabel}>
        <DatePicker
          value={fromValue ? fromValue.toISOString().slice(0, 10) : undefined}
          onChange={(d) =>
            onFromChange(d ? new Date(`${d}T00:00:00Z`) : undefined)
          }
          placeholder="dd/mm/yyyy"
          className="h-10! w-full"
        />
      </FormField>

      <FormField label={toLabel}>
        <DatePicker
          value={toValue ? toValue.toISOString().slice(0, 10) : undefined}
          onChange={(d) =>
            onToChange(d ? new Date(`${d}T00:00:00Z`) : undefined)
          }
          placeholder="dd/mm/yyyy"
          className="h-10! w-full"
        />
      </FormField>
    </div>
  );
};
