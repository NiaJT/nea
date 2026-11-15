import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

const FormField = ({
  label,
  hint,
  error,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-sm text-black">
      {label} {hint && <span className="text-gray-400">({hint})</span>}
    </label>
    {children}
    {error && <p className="-mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FormField;
