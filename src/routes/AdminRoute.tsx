import { Outlet } from "react-router";
import { useMe } from "@/action/useAuth";
import { isAdminUser } from "@/utils/access";
import PageNotFound from "@/pages/PageNotFound";

const AdminRoute = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  return isAdminUser(user) ? <Outlet /> : <PageNotFound />;
};

export default AdminRoute;
