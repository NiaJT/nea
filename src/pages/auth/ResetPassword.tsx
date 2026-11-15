import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import AuthLayout from "@/layout/AuthLayout";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LuLock, LuSend } from "react-icons/lu";
import FormInput from "@/component/common/FormInput";
import PasswordStrength from "@/component/common/PasswordStrength";
import DarkButton from "@/component/common/DarkButton";
import { resetPasswordSchema } from "@/validation/auth.schema";
import { useResetPassword } from "@/action/useAuth";

type FieldErrors = {
  newPassword?: string;
  confirmPassword?: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  // token comes directly from the URL, set by the backend's reset link — not user-editable
  const token = params.get("token") ?? "";

  const email = (location.state as { email?: string } | null)?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (!token) {
      // no token in the URL at all — nothing to submit against
      return;
    }

    resetPassword(
      {
        token,
        password: newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          navigate("/login", { replace: true });
        },
      },
    );
  };

  return (
    <AuthLayout variant="reset">
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-black">
          Reset your password
        </h1>
        <p className="mt-4 text-base text-black font-normal">
          {email ? (
            <>
              Resetting password for{" "}
              <span className="font-semibold">{email}</span>
            </>
          ) : (
            "Enter your new password below."
          )}
        </p>

        {!token && (
          <p className="mt-4 text-sm font-medium text-danger">
            This reset link is invalid or missing a token. Please request a new
            one from the Forgot Password page.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-normal">
              New Password
            </Label>
            <FormInput
              id="newPassword"
              name="reset-new-secret"
              type="password"
              icon={LuLock}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword)
                  setErrors((p) => ({ ...p, newPassword: undefined }));
              }}
              placeholder="Enter new password"
              autoComplete="new-password"
              noAutofill
              error={errors.newPassword}
            />
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-normal">
              Confirm Password
            </Label>
            <FormInput
              id="confirmPassword"
              name="reset-confirm-secret"
              type="password"
              icon={LuLock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((p) => ({ ...p, confirmPassword: undefined }));
              }}
              placeholder="Re-Enter new password"
              autoComplete="new-password"
              noAutofill
              error={errors.confirmPassword}
            />
          </div>

          <div className="mt-6">
            <PasswordStrength password={newPassword} />
          </div>

          <DarkButton
            type="submit"
            icon={LuSend}
            loading={isPending}
            loadingText="Resetting..."
            disabled={!token}
            className="mt-6"
          >
            Reset Password
          </DarkButton>
        </form>

        <Separator className="my-8 bg-gray-300" />

        <p className="text-center text-sm leading-6 text-cardBg">
          Contact PMS Support at{" "}
          <span className="cursor-pointer font-semibold">
            pms-support@nea.org.np
          </span>{" "}
          or organizations's system administration.
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
