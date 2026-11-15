import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LuLock, LuSave } from "react-icons/lu";
import FormInput from "@/component/common/FormInput";
import PasswordStrength from "@/component/common/PasswordStrength";
import DarkButton from "@/component/common/DarkButton";
import LightButton from "@/component/common/LightButton";
import {
  changePasswordSchema,
  type ChangePasswordFieldErrors,
} from "@/validation/auth.schema";
import { useChangePassword, useLogout, useMe } from "@/action/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ChangePasswordFieldErrors>({});

  const queryClient = useQueryClient();
  const { mutate: changePassword, isPending } = useChangePassword();
  const { mutateAsync: logoutAsync } = useLogout();
  const { data: currentUser } = useMe();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: ChangePasswordFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ChangePasswordFieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    changePassword(
      {
        currentPassword,
        password: newPassword,
        confirmPassword,
      },
      {
        onSuccess: async () => {
          try {
            await logoutAsync();
          } catch {}
          queryClient.setQueryData(["me"], null);
          navigate("/login", { replace: true });
        },
      },
    );
  };

  return (
    <div className="flex flex-col justify-center items-center px-4 py-7">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-blackColor">Change Password</h1>
        <p className="mt-2 text-sm text-black">
          Update your current password. You will remain signed in on this device
          after changing your password.
        </p>

        <div className="mt-6 rounded-lg border border-lightGray bg-white p-6">
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={currentUser?.email ?? ""}
              readOnly
              hidden
              aria-hidden="true"
              tabIndex={-1}
            />

            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-semibold text-blackColor"
              >
                Current Password
              </Label>
              <FormInput
                id="currentPassword"
                name="change-current-secret"
                type="password"
                icon={LuLock}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.currentPassword)
                    setErrors((p) => ({ ...p, currentPassword: undefined }));
                }}
                placeholder="Enter new password"
                autoComplete="current-password"
                noAutofill
                error={errors.currentPassword}
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-semibold text-blackColor"
              >
                New Password
              </Label>
              <FormInput
                id="newPassword"
                name="change-new-secret"
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
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-blackColor"
              >
                Confirm new Password
              </Label>
              <FormInput
                id="confirmPassword"
                name="change-confirm-secret"
                type="password"
                icon={LuLock}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                noAutofill
                error={errors.confirmPassword}
              />
            </div>

            <div className="mt-6">
              <PasswordStrength password={newPassword} />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <LightButton
                type="button"
                onClick={() => navigate(-1)}
                className="w-auto px-6"
              >
                Cancel
              </LightButton>

              <DarkButton
                type="submit"
                icon={LuSave}
                loading={isPending}
                loadingText="Resetting..."
                className="w-auto px-6"
              >
                Reset Password
              </DarkButton>
            </div>
          </form>

          <Separator className="my-6 bg-gray-200" />

          <p className="text-center text-sm text-cardBg">
            Contact PMS Support at{" "}
            <span className="font-semibold text-orderlyPrimary cursor-pointer">
              pms-support@nea.org.np
            </span>{" "}
            or organizations's system administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
