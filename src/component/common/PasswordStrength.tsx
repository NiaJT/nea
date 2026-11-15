import { LuCircle, LuCircleCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { passwordRules } from "@/validation/auth.schema";

const levels = [
  { label: "", color: "" },
  { label: "Weak", color: "bg-red-500", text: "text-red-500" },
  { label: "Moderate", color: "bg-yellow-500", text: "text-yellow-500" },
  { label: "Good", color: "bg-green-500", text: "text-green-500" },
  { label: "Strong", color: "bg-green-600", text: "text-green-600" },
] as const;

const PasswordStrength = ({ password }: { password: string }) => {
  const results = passwordRules.map((r) => ({ ...r, ok: r.test(password) }));
  const score = password ? results.filter((r) => r.ok).length : 0;
  const level = levels[score];

  return (
    <div className="rounded-lg border border-gray-200 bg-[#F0FDFA80] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-black">
          Forgot your password?
        </h3>
        {score > 0 && (
          <span
            className={cn(
              "text-sm font-semibold",
              "text" in level && level.text,
            )}
          >
            {level.label}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i <= score ? level.color : "bg-gray-300",
            )}
          />
        ))}
      </div>

      <ul className="mt-5 space-y-2.5">
        {results.map(({ id, label, ok }) => (
          <li
            key={id}
            className={cn(
              "flex items-center gap-2 text-sm",
              ok ? "text-green-600" : "text-gray-400",
            )}
          >
            {ok ? (
              <LuCircleCheck className="size-5" />
            ) : (
              <LuCircle className="size-5" />
            )}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrength;
