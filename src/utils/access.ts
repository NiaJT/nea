import type { ILoginResponseData } from "@/type/auth.type";

export const isAdminUser = (user?: ILoginResponseData | null) =>
  !!user &&
  (user.roles?.includes("SYSTEM_ADMIN") || user.organization?.type === "NEA");
