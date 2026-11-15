import { useMe } from "@/action/useAuth";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const { data: user, isLoading, isError } = useMe({ revalidate: false });

  if (isLoading) {
    return null;
  }

  const isAuthenticated = !isError && !!user;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
