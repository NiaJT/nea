import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection = ({ title, children, className }: FormSectionProps) => (
  <section
    className={cn("rounded-lg border border-gray-200 bg-white p-6", className)}
  >
    <h2 className="text-xl font-semibold text-black">{title}</h2>
    <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
      {children}
    </div>
  </section>
);

export default FormSection;
