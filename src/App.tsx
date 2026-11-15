import { Route, Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import DashboardLayout from "./layout/DashboardLayout";
import UserManagement from "./pages/user/userManagement/UserManagement";
import RolesPermission from "./pages/user/roles/RolesPermission";
import RolePermissionAssignment from "./pages/user/roles/RolesPermissionAssignment";
import AddEditUser from "./pages/user/userManagement/AddEditUser";
import Organizations from "./pages/user/organization/Organizations";
import ForcePasswordChangeGuard from "./routes/ForcePasswordChangeGuard";
import PublicRoute from "./routes/PublicRoute";
import UserDetails from "./pages/user/userManagement/UserDetails";
import Project from "./pages/user/project/Project";
import AddEditProject from "./pages/user/project/AddEditProject";
import ProjectDetails from "./pages/user/project/ProjectDetails";
import AddEditPackage from "./pages/user/project/AddEditPackage";
import PackageDetails from "./pages/user/project/PackageDetails";
import Dashboard from "./pages/user/dashboard/Dashboard";
import Document from "./pages/user/document/Document";
import AddEditDocument from "./pages/user/document/AddEditDocument";
import DocumentDetail from "./pages/user/document/DocumentDetail";
import ReviseDocument from "./pages/user/document/ReviseDocument";
import DocumentRevisionHistory from "./pages/user/document/document-tracking/DocumentRevisionHistory";
import DocumentTrackingIndex from "./pages/user/document/document-tracking/DocumentTrackingIndex";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<ForcePasswordChangeGuard />}>
            <Route element={<DashboardLayout />}>
              <Route path="/changePassword" element={<ChangePassword />} />

              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/users/add" element={<AddEditUser />} />
              <Route path="/users/:id/edit" element={<AddEditUser />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/roles" element={<RolesPermission />} />
              <Route
                path="/roles/:roleId"
                element={<RolePermissionAssignment />}
              />

              <Route path="/organizations" element={<Organizations />} />

              <Route path="/projects" element={<Project />} />
              <Route path="/projects/add" element={<AddEditProject />} />
              <Route path="/projects/:id/edit" element={<AddEditProject />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />

              <Route path="/packages/add" element={<AddEditPackage />} />
              <Route path="/packages/:id/edit" element={<AddEditPackage />} />
              <Route path="/packages/:id" element={<PackageDetails />} />

              <Route path="/documents" element={<Document />} />
              <Route path="/documents/upload" element={<AddEditDocument />} />

              <Route
                path="/documents-tracking"
                element={<DocumentTrackingIndex />}
              />
              <Route
                path="/documents-tracking/:tab"
                element={<DocumentTrackingIndex />}
              />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route
                path="/documents/:id/revise"
                element={<ReviseDocument />}
              />
              <Route
                path="/documents/:id/history"
                element={<DocumentRevisionHistory />}
              />
            </Route>
          </Route>
          <Route path="/changePassword" element={<ChangePassword />} />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
