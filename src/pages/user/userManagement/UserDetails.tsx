import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { FiLock } from "react-icons/fi";
import { LuLoaderCircle } from "react-icons/lu";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import StatusBadge from "@/component/userPages/StatusBadge";
import UserSidePanel from "@/component/userPages/UserSidePanel";
import LightButton from "@/component/common/LightButton";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IUser } from "@/type/user.type";
import { Badge } from "@/components/ui/badge";
import { useToggleUserStatus, useUser } from "@/action/useUsers";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import { cn } from "@/lib/utils";

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-gray-200 bg-white p-6">
    <h2 className="mb-6 text-xl font-semibold text-black">{title}</h2>
    {children}
  </section>
);

const InfoField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-base text-black">{label}</p>
    <div className="text-base text-gray-500">{children}</div>
  </div>
);

const AccountStatus = ({ status }: { status: IUser["userStatus"] }) => (
  <StatusBadge status={status} />
);

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? Number(id) : undefined;

  const { can } = usePermissions();
  const canView = can(PERMISSIONS.USER.VIEW);
  const canUpdate = can(PERMISSIONS.USER.UPDATE);
  const canViewProject = can(PERMISSIONS.PROJECT.VIEW);

  const { data, isLoading, isError } = useUser(userId, { enabled: canView });
  const user = data?.data;
  const toggleStatus = useToggleUserStatus();
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const active = user?.userStatus === "ACTIVE";
  const projects = user?.assignedProjects ?? [];
  const packages = user?.assignedPackages ?? [];

  const handleToggleStatus = () => {
    if (userId === undefined || !canUpdate) return;
    toggleStatus.mutate(userId, { onSuccess: () => setDeactivateOpen(false) });
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/administration" },
            { label: "Users", href: "/users" },
            { label: "User Details" },
          ]}
        />
        <PageHeader
          title="User Details"
          description="View account, role, project access and activity information."
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LuLoaderCircle className="size-6 animate-spin text-gray-400" />
          </div>
        ) : isError || !user ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">This user could not be found.</p>
            <LightButton className="w-40" onClick={() => navigate("/users")}>
              Back to Users
            </LightButton>
          </div>
        ) : (
          <>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
              <div className="flex flex-col gap-6">
                <Card title="Personal / Account Information">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <InfoField label="Full Name">{user.fullName}</InfoField>
                    <InfoField label="Username">{user.username}</InfoField>
                    <InfoField label="Email">{user.email}</InfoField>
                    <InfoField label="Phone Number">
                      {user.phoneNumber ?? "-"}
                    </InfoField>
                    <InfoField label="Organization">
                      {user.organizationName ?? "-"}
                    </InfoField>
                    <InfoField label="Account Status">
                      <AccountStatus status={user.userStatus} />
                    </InfoField>
                  </div>
                </Card>

                <Card title="Project Information">
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-slate-50">
                          {["Project Name", "Role", "Status", "Action"].map(
                            (h) => (
                              <TableHead
                                key={h}
                                className="h-12 text-center text-sm font-semibold text-black"
                              >
                                {h}
                              </TableHead>
                            ),
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="h-16 text-center text-sm text-slate-500"
                            >
                              No projects assigned
                            </TableCell>
                          </TableRow>
                        ) : (
                          projects.map((p) => (
                            <TableRow key={p.id} className="h-14">
                              <TableCell className="text-center text-sm text-gray-500">
                                {p.name}
                              </TableCell>
                              <TableCell className="text-center text-sm text-gray-500">
                                {user.roleName}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <AccountStatus status={user.userStatus} />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <span
                                    className={
                                      canViewProject
                                        ? undefined
                                        : "cursor-not-allowed"
                                    }
                                    title={
                                      canViewProject
                                        ? undefined
                                        : "You don't have permission"
                                    }
                                  >
                                    <button
                                      type="button"
                                      disabled={!canViewProject}
                                      onClick={() =>
                                        navigate(`/projects/${p.id}`)
                                      }
                                      className={cn(
                                        "cursor-pointer rounded-md bg-slate-100 px-4 py-1.5 text-sm text-gray-800 transition-colors hover:bg-slate-200",
                                        !canViewProject &&
                                          "pointer-events-none opacity-40",
                                      )}
                                    >
                                      View
                                    </button>
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                <Card title="Role & Project Access">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <InfoField label="Primary Role">{user.roleName}</InfoField>
                    <InfoField label="Assigned Projects">
                      {projects.length === 0 ? (
                        "-"
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {projects.map((p) => (
                            <Badge
                              key={p.id}
                              variant="secondary"
                              className="rounded-full border-gray-100 bg-gray-50 px-3 py-1 text-xs font-normal text-gray-800"
                            >
                              {p.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </InfoField>

                    <InfoField label="Assigned Packages">
                      {packages.length === 0 ? (
                        "-"
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {packages.map((p) => (
                            <Badge
                              key={p.id}
                              variant="secondary"
                              className="rounded-full border-gray-100 bg-gray-50 px-3 py-1 text-xs font-normal text-gray-800"
                            >
                              {p.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </InfoField>
                  </div>

                  <div className="mt-8 flex items-start gap-4 rounded-md bg-slate-50 px-4 py-3">
                    <FiLock size={24} className="mt-0.5 shrink-0 text-black" />
                    <div>
                      <p className="text-base font-semibold text-black">
                        Permission &amp; Access
                      </p>
                      <p className="mt-0.5 text-sm text-gray-400">
                        Full project access &nbsp;•&nbsp; Document management
                        &nbsp;•&nbsp; Report access &nbsp;•&nbsp; System
                        setting(limited)
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <UserSidePanel
                user={user}
                active={active}
                showProfile={false}
                onResendActivation={() => {}}
                onResetPassword={() => {}}
                onDeactivate={() => setDeactivateOpen(true)}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmAlertDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={active ? "Deactivate this account?" : "Activate this account?"}
        description={
          active
            ? `${user?.fullName ?? "This user"} will no longer be able to log in until the account is reactivated.`
            : `${user?.fullName ?? "This user"} will be able to log in again.`
        }
        confirmText={active ? "Deactivate" : "Activate"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
};

export default UserDetails;
