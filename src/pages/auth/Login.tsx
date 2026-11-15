import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import AuthLayout from "@/layout/AuthLayout";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { LuUser, LuLock, LuLogIn, LuTriangleAlert } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import FormInput from "@/component/common/FormInput";
import DarkButton from "@/component/common/DarkButton";
import { loginSchema } from "@/validation/auth.schema";
import { useLogin } from "@/action/useAuth";
import { SESSION_EXPIRED_KEY } from "@/api";
import { errorToast } from "@/component/common/Toasts";

type FieldErrors = { email?: string; password?: string };

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [armed, setArmed] = useState(false);

  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      errorToast("Session expired", "Please log in again to continue.");
    }
  }, []);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

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

    // navigate("/", { replace: true });

    login(
      { email, password, rememberMe: remember },
      {
        onSuccess: (res) => {
          const { mustChangePassword } = res.data.data;
          navigate(mustChangePassword ? "/changePassword" : "/", {
            replace: true,
          });
        },
      },
    );
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h1 className="text-2xl font-semibold text-black md:text-3xl lg:text-4xl">
          Sign into your account
        </h1>
        <p className="mt-3 text-sm text-black md:mt-4 md:text-base">
          Enter your credentials to access the Project Management System.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 lg:mt-8">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-normal">
              Username or Email
            </Label>
            <FormInput
              id="email"
              name="username"
              icon={LuUser}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="rajeshsingh or rajesh@nea.gov.np"
              autoComplete="username"
              noAutofill
              armed={armed}
              onArm={() => setArmed(true)}
              error={errors.email}
            />
          </div>

          <div className="mt-4 space-y-2 lg:mt-5">
            <Label htmlFor="password" className="text-sm font-normal">
              Password
            </Label>
            <FormInput
              id="password"
              name="password"
              type="password"
              icon={LuLock}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              noAutofill
              armed={armed}
              onArm={() => setArmed(true)}
              error={errors.password}
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 lg:mt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
                className="size-4 rounded border-black data-[state=checked]:border-black data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Link
              to="/forgotPassword"
              className="whitespace-nowrap text-sm font-semibold text-textCyan hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <DarkButton
            type="submit"
            icon={LuLogIn}
            loading={isPending}
            loadingText="Signing in..."
            className="mt-5 lg:mt-6"
          >
            Sign In
          </DarkButton>
        </form>

        <Alert className="mt-6 flex items-center gap-x-6 rounded-lg border-0 bg-yellow-50 px-6 py-4 shadow-none lg:mt-8 lg:py-6">
          <LuTriangleAlert className="size-5 shrink-0" color="#A16207" />
          <AlertDescription className="text-sm font-semibold leading-snug text-yellow-700">
            The system is restricted to authorized NEA, Consultant, and
            Contractor personnel.
          </AlertDescription>
        </Alert>

        <Separator className="my-6 bg-gray-300 lg:my-8" />

        <div className="space-y-4 text-center text-cardBg lg:space-y-5">
          <p className="text-sm font-medium">
            Need access or having trouble signing in?
          </p>
          <p className="text-sm leading-5">
            Contact PMS Support at{" "}
            <span className="font-semibold cursor-pointer">
              pms-support@nea.org.np
            </span>{" "}
            or organizations's system administration.
          </p>
          <p className="text-sm leading-5 text-textCyan">
            There is no public self-registration for this system. All accounts
            are provisioned by NEA Administration.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
