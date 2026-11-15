import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ME_QUERY_KEY, useMe } from "@/action/useAuth";
import { LuLoaderCircle } from "react-icons/lu";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useMe();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ME_QUERY_KEY, stale: true });
  }, [location.pathname, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-darkGray text-sm">
        <LuLoaderCircle className="size-6 animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword && location.pathname !== "/changePassword") {
    return <Navigate to="/changePassword" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
