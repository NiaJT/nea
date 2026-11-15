import { createBrowserRouter } from "react-router";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForcePasswordChangeGuard from "./routes/ForcePasswordChangeGuard";
import DashboardLayout from "./layout/DashboardLayout";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "./pages/user/dashboard/Dashboard";
import UserManagement from "./pages/user/userManagement/UserManagement";
import AddEditUser from "./pages/user/userManagement/AddEditUser";
import UserDetails from "./pages/user/userManagement/UserDetails";
import RolesPermission from "./pages/user/roles/RolesPermission";
import RolePermissionAssignment from "./pages/user/roles/RolesPermissionAssignment";
import Organizations from "./pages/user/organization/Organizations";
import Project from "./pages/user/project/Project";
import AddEditProject from "./pages/user/project/AddEditProject";
import ProjectDetails from "./pages/user/project/ProjectDetails";
import AddEditPackage from "./pages/user/project/AddEditPackage";
import PackageDetails from "./pages/user/project/PackageDetails";
import Document from "./pages/user/document/Document";
import AddEditDocument from "./pages/user/document/AddEditDocument";
import DocumentDetail from "./pages/user/document/DocumentDetail";
import ReviseDocument from "./pages/user/document/ReviseDocument";
import PageNotFound from "./pages/PageNotFound";
import PackageTypeLayout from "./pages/user/project/package-type/PackageTypeLayout";
import PackageType from "./pages/user/project/package-type/PackageType";
import AddEditPackageType from "./pages/user/project/package-type/AddEditPackageType";
import DocumentLayout from "./pages/user/document/DocumentLayout";
import DocumentTypeLayout from "./pages/user/document/document-type/DocumentTypeLayout";
import DocumentType from "./pages/user/document/document-type/DocumentType";
import AddEditDocumentType from "./pages/user/document/document-type/AddEditDocumentType";
import DocumentCategoryLayout from "./pages/user/document/document-category/DocumentCategoryLayout";
import DocumentCategory from "./pages/user/document/document-category/DocumentCategory";
import AddEditDocumentCategory from "./pages/user/document/document-category/AddEditDocumentCategory";
import DocumentTrackingIndex from "./pages/user/document/document-tracking/DocumentTrackingIndex";
import RegisterSubmission from "./pages/user/document/RegisterSubmission";
import SubmissionDetailsPage from "./pages/user/document/document-tracking/SubmissionDetails";
import ReviewDocument from "./pages/user/document/document-tracking/ReviewDocument";
import RecommendationDocument from "./pages/user/document/document-tracking/DocumentRecommendation";
import DocumentDecision from "./pages/user/document/document-tracking/DocumentDecision";
import ContractorResponse from "./pages/user/document/document-tracking/ContractorResponse";
import AdminRoute from "./routes/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <ForcePasswordChangeGuard />,
        children: [
          // ───────── ADMIN ONLY: guard sits OUTSIDE the layout ─────────
          {
            element: <AdminRoute />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  { path: "users", element: <UserManagement /> },
                  { path: "users/add", element: <AddEditUser /> },
                  { path: "users/:id/edit", element: <AddEditUser /> },
                  { path: "users/:id", element: <UserDetails /> },

                  { path: "roles", element: <RolesPermission /> },
                  {
                    path: "roles/:roleId",
                    element: <RolePermissionAssignment />,
                  },

                  { path: "organizations", element: <Organizations /> },

                  {
                    path: "package-type",
                    element: <PackageTypeLayout />,
                    children: [
                      { path: "", element: <PackageType /> },
                      { path: "add", element: <AddEditPackageType /> },
                      { path: ":id/edit", element: <AddEditPackageType /> },
                    ],
                  },
                  {
                    path: "document-type",
                    element: <DocumentTypeLayout />,
                    children: [
                      { path: "", element: <DocumentType /> },
                      { path: "add", element: <AddEditDocumentType /> },
                      { path: ":id/edit", element: <AddEditDocumentType /> },
                    ],
                  },
                  {
                    path: "document-category",
                    element: <DocumentCategoryLayout />,
                    children: [
                      { path: "", element: <DocumentCategory /> },
                      { path: "add", element: <AddEditDocumentCategory /> },
                      {
                        path: ":id/edit",
                        element: <AddEditDocumentCategory />,
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ───────── EVERYONE: normal layout ─────────
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "changePassword",
                element: <ChangePassword />,
              },
              {
                index: true,
                element: <Dashboard />,
              },

              {
                path: "projects",
                element: <Project />,
              },
              {
                path: "projects/add",
                element: <AddEditProject />,
              },
              {
                path: "projects/:id/edit",
                element: <AddEditProject />,
              },
              {
                path: "projects/:id",
                element: <ProjectDetails />,
              },

              {
                path: "packages/add",
                element: <AddEditPackage />,
              },
              {
                path: "packages/:id/edit",
                element: <AddEditPackage />,
              },
              {
                path: "packages/:id",
                element: <PackageDetails />,
              },
              {
                path: "documents",
                element: <DocumentLayout />,
                children: [
                  {
                    path: "",
                    element: <Document />,
                  },
                  {
                    path: "upload",
                    element: <AddEditDocument />,
                  },
                  {
                    path: ":id",
                    element: <DocumentDetail />,
                  },
                  {
                    path: ":id/revise",
                    element: <ReviseDocument />,
                  },
                  {
                    path: "register-submission",
                    element: <RegisterSubmission />,
                  },
                  {
                    path: "register-submission/:documentId",
                    element: <RegisterSubmission />,
                  },
                ],
              },
              {
                path: "documents-tracking",
                element: <DocumentTrackingIndex />,
              },
              {
                path: "documents-tracking/:tab",
                element: <DocumentTrackingIndex />,
              },
              {
                path: "documents-tracking/details/:id",
                element: <SubmissionDetailsPage />,
              },
              {
                path: "documents/review",
                element: <ReviewDocument />,
              },
              {
                path: "documents/recommendation",
                element: <RecommendationDocument />,
              },
              {
                path: "documents/decision",
                element: <DocumentDecision />,
              },
              {
                path: "documents/contractor-response",
                element: <ContractorResponse />,
              },
              // {
              //   path: "documents/upload",
              //   element: <AddEditDocument />,
              // },
              // {
              //   path: "documents/:id",
              //   element: <DocumentDetail />,
              // },
              // {
              //   path: "documents/:id/revise",
              //   element: <ReviseDocument />,
              // },
              // {
              //   path: "documents/:id/history",
              //   element: <DocumentRevisionHistory />,
              // },
            ],
          },
        ],
      },
      {
        path: "changePassword",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
