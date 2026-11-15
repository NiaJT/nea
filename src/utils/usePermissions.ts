import { useMemo } from "react";
import { useMe } from "@/action/useAuth";

export const usePermissions = () => {
  const { data: user, isLoading } = useMe({ refetchOnMount: "always" });

  const granted = useMemo(
    () => new Set((user?.permissions ?? []).flatMap((m) => m.permissions)),
    [user],
  );
  const isSystemAdmin = user?.roles?.includes("SYSTEM_ADMIN") ?? false;

  const can = (permission: string) => isSystemAdmin || granted.has(permission);
  return { can, isLoading };
};
