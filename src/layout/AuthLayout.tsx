import { Fragment, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import authImage from "@/assets/images/authImage.jpg";
import { authContent, type AuthVariant } from "@/utils/authContent";

interface AuthLayoutProps {
  children: ReactNode;
  variant?: AuthVariant;
}

const AuthLayout = ({ children, variant = "login" }: AuthLayoutProps) => {
  const { titleLines, description, cards } = authContent[variant];
  const single = cards.length === 1;

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      <div className="flex h-full w-full">
        <aside className="relative hidden h-full w-[55%] shrink-0 overflow-hidden lg:block">
          <img
            src={authImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 z-10 flex flex-col px-6 py-15.5">
            <div className="flex items-center gap-6">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-xl font-semibold text-white">
                NEA
              </div>

              <div className="text-white">
                <h2 className="text-xl font-semibold leading-tight">
                  Nepal Electricity Authority
                </h2>
                <p className="mt-2 flex items-center gap-2 text-base">
                  Government of Nepal
                  <span className="size-1.5 rounded-full bg-white" />
                  Ministry of Energy
                </p>
              </div>
            </div>

            <div className="mt-37.5 flex items-center">
              <div className="ml-35 w-[50%] text-white">
                <h1 className="whitespace-nowrap text-5xl font-bold leading-[1.05]">
                  {titleLines.map((line, i) => (
                    <Fragment key={line}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </h1>

                <p className="mt-5 text-base leading-6">{description}</p>

                <div
                  className={`mt-6 grid gap-6 ${
                    single ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {cards.map(({ title, icon: Icon }) => (
                    <Card
                      key={title}
                      className="min-h-20 gap-0 rounded-[8px] border border-borderCard bg-cardBg py-0 text-white shadow-none"
                    >
                      <CardContent className="flex min-h-20 flex-col justify-center gap-2 px-3 py-3">
                        <Icon className="size-5" />
                        <span className="text-sm leading-tight">{title}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex h-full min-w-0 flex-1 items-center justify-center overflow-y-auto px-20 lg:w-[45%] lg:flex-none">
          <div className="w-full max-w-125">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
