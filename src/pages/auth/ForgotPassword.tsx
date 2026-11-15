import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "@/layout/AuthLayout";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LuArrowLeft, LuUser, LuSend } from "react-icons/lu";
import FormInput from "@/component/common/FormInput";
import DarkButton from "@/component/common/DarkButton";
import { forgotPasswordSchema } from "@/validation/auth.schema";
import { useForgotPassword } from "@/action/useAuth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(undefined);

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          navigate("/reset-password", { state: { email } });
        },
      },
    );
  };

  return (
    <AuthLayout variant="forgot">
      <div className="w-full">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-textCyan hover:underline"
        >
          <LuArrowLeft className="size-5" />
          Back to Sign In
        </Link>

        <h1 className="mt-6 text-3xl font-semibold text-black">
          Forgot your password?
        </h1>
        <p className="mt-4 text-base leading-6 text-black">
          Enter your registered username or email address and we'll send you
          instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-9">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal">
              Username or Email
            </Label>
            <FormInput
              id="email"
              name="recovery-identifier"
              icon={LuUser}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(undefined);
              }}
              placeholder="rajeshsingh or rajesh@nea.gov.np"
              autoComplete="off"
              noAutofill
              error={error}
            />
          </div>

          <DarkButton
            type="submit"
            icon={LuSend}
            loading={isPending}
            loadingText="Sending..."
            className="mt-8"
          >
            Send Reset Instructions
          </DarkButton>
        </form>

        <Link
          to="/login"
          className="mt-6 block text-center text-sm text-textCyan hover:underline"
        >
          Back to Sign In
        </Link>

        <Separator className="my-8 bg-gray-300" />

        <p className="mt-10 text-center text-sm leading-6 text-cardBg">
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

export default ForgotPassword;
