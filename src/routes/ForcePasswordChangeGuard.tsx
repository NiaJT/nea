import { useMe } from "@/action/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

const ForcePasswordChangeGuard = () => {
  const { data: user, isLoading } = useMe();
  const { pathname } = useLocation();

  if (isLoading) return null; // or a full-page spinner

  if (user?.mustChangePassword && pathname !== "/changePassword") {
    return <Navigate to="/changePassword" replace />;
  }

  return <Outlet />;
};

export default ForcePasswordChangeGuard;
