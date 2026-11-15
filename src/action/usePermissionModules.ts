import requests from "@/helper/requests";
import { useQuery } from "@tanstack/react-query";

export const permissionModuleKeys = {
  all: ["permission-modules"] as const,
};

export const usePermissionModules = () =>
  useQuery({
    queryKey: permissionModuleKeys.all,
    queryFn: async () => (await requests.permission.getModules()).data,
  });
