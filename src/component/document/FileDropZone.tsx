import { FiUploadCloud } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface MainFileDropZoneProps {
  id: string;
  title: string;
  hint?: string;
  label: string;
  disabled?: boolean;
  onChange: (files: File[]) => void;
}

export const MainFileDropZone = ({
  id,
  title,
  hint,
  label,
  disabled,
  onChange,
}: MainFileDropZoneProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onChange(files);
    e.target.value = "";
  };

  return (
    <div className="rounded-[10px] border-2 border-dashed border-[#BFD3E3] bg-[#F8FBFD] p-[28px_17px]">
      <p className="text-base font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
        {title}
      </p>
      {hint && (
        <p className="mt-2 text-xs leading-[14px] text-[#718499]">{hint}</p>
      )}

      <label
        htmlFor={id}
        className={cn(
          "mt-2 flex h-[110px] w-full cursor-pointer flex-col items-center justify-center gap-[7px] rounded-lg border border-[#D7E2EC] bg-white transition hover:bg-[#F7FAFC]",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <FiUploadCloud className="size-10 text-black" />
        <span className="text-xs font-semibold leading-[14px] text-black">
          {label}
        </span>
        <input
          id={id}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  The compact inline box for supporting attachments                         */
/* -------------------------------------------------------------------------- */

interface SupportingFilesDropZoneProps {
  id: string;
  label: string;
  disabled?: boolean;
  onChange: (files: File[]) => void;
}

export const SupportingFilesDropZone = ({
  id,
  label,
  disabled,
  onChange,
}: SupportingFilesDropZoneProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onChange(files);
    e.target.value = "";
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-[80px] w-full cursor-pointer flex-row items-center justify-center gap-[7px] rounded-lg border border-[#D7E2EC] bg-white transition hover:bg-[#F7FAFC]",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <FiUploadCloud className="size-10 text-black" />
      <span className="text-xs font-semibold leading-[14px] text-black">
        {label}
      </span>
      <input
        id={id}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  );
};

/* -------------------------------------------------------------------------- */
/*  Optional: keep the old generic drop zone if used elsewhere                */
/* -------------------------------------------------------------------------- */

interface FileDropZoneProps {
  id: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  variant?: "large" | "compact";
  onChange: (files: File[]) => void;
}

const FileDropZone = ({
  id,
  label,
  hint,
  multiple = false,
  accept,
  disabled,
  variant = "compact",
  onChange,
}: FileDropZoneProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onChange(files);
    e.target.value = "";
  };

  const isLarge = variant === "large";

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border transition",
        disabled && "pointer-events-none opacity-60",
        isLarge
          ? "h-[110px] border-[#D7E2EC] bg-white hover:bg-[#F7FAFC]"
          : "h-[80px] border-[#D7E2EC] bg-white hover:bg-[#F7FAFC]",
      )}
    >
      <FiUploadCloud
        className={cn("text-black", isLarge ? "size-10" : "size-8")}
      />
      <span className="text-xs font-semibold text-black">{label}</span>
      {hint && <span className="text-xs text-[#718499]">{hint}</span>}
      <input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  );
};

export default FileDropZone;
