import { forwardRef, useState, type InputHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: IconType;
  error?: string;
  className?: string;
  noAutofill?: boolean;
  armed?: boolean;
  onArm?: () => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      icon: Icon,
      type = "text",
      error,
      className,
      noAutofill = false,
      armed: armedProp,
      onArm,
      readOnly,
      onFocus,
      onPointerDown,
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = useState(false);
    const [ownArmed, setOwnArmed] = useState(!noAutofill);
    const isPassword = type === "password";

    const armed = armedProp ?? ownArmed;
    const arm = () => {
      setOwnArmed(true);
      onArm?.();
    };
    return (
      <div>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
          )}

          <Input
            ref={ref}
            type={isPassword && show ? "text" : type}
            aria-invalid={!!error}
            readOnly={readOnly || !armed}
            onPointerDown={(e) => {
              arm();
              onPointerDown?.(e);
            }}
            onFocus={(e) => {
              arm();
              onFocus?.(e);
            }}
            className={cn(
              "h-11 rounded-lg border-border text-base placeholder:text-[#00000080] focus-visible:border-border focus-visible:ring-0 focus-visible:outline-none aria-invalid:border-border aria-invalid:ring-0",
              Icon && "pl-11",
              isPassword && "pr-11",
              className,
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black"
            >
              {show ? (
                <LuEyeOff className="size-5" />
              ) : (
                <LuEye className="size-5" />
              )}
            </button>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
