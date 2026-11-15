import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import FilterSelect, { ALL_VALUE } from "@/component/userPages/FilterSelect";
import { getUserColumns } from "../../../component/tableColumns/userColumns";
import SearchInput from "@/component/userPages/SearchInput";
import DataTable from "@/component/userPages/DataTable";
import { STATUS_OPTIONS } from "@/utils/UserData";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { useNavigate } from "react-router";
import type { IUser } from "@/type/user.type";
import {
  useDeleteUser,
  useToggleUserStatus,
  useUsers,
} from "@/action/useUsers";
import { useOrganizations } from "@/action/useOrganizations";
import { useRoles } from "@/action/useRoles";
import { useDebounce } from "@/hooks/useDebounce";
import NoPermission from "@/component/userPages/NoPermission";
import { cn } from "@/lib/utils";
import { isAxiosError } from "axios";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

const PAGE_SIZE = 10;
const MIN_SEARCH_LENGTH = 3;

const UserManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState(ALL_VALUE);
  const [role, setRole] = useState(ALL_VALUE);
  const [project, setProject] = useState(ALL_VALUE);
  const [status, setStatus] = useState(ALL_VALUE);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);

  const apiSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.USER.VIEW);
  const canCreate = can(PERMISSIONS.USER.CREATE);
  const canUpdate = can(PERMISSIONS.USER.UPDATE);
  const canDelete = can(PERMISSIONS.USER.DELETE);

  const { data, isLoading, isFetching, error } = useUsers(
    {
      page,
      perPage: PAGE_SIZE,
      search: apiSearch,
      status: status === ALL_VALUE ? "" : status,
      organizationId: org === ALL_VALUE ? undefined : Number(org),
      roleId: role === ALL_VALUE ? undefined : Number(role),
    },
    { enabled: canView },
  );

  const isForbidden =
    (!permLoading && !canView) ||
    (isAxiosError(error) && error.response?.status === 403);

  const { data: orgRes } = useOrganizations({ page: 1, perPage: 100 });
  const { data: roleRes } = useRoles({ page: 1, perPage: 100 });

  const orgOptions = useMemo(
    () =>
      (orgRes?.data ?? []).map((o) => ({
        value: String(o.id),
        label: o.orgName,
      })),
    [orgRes],
  );

  const roleOptions = useMemo(
    () =>
      (roleRes?.data ?? [])
        .filter((r) => org === ALL_VALUE || String(r.organizationId) === org)
        .map((r) => ({
          value: String(r.id),
          label: r.name,
        })),
    [roleRes, org],
  );

  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  const clearFilters = () => {
    setSearch("");
    setOrg(ALL_VALUE);
    setRole(ALL_VALUE);
    setProject(ALL_VALUE);
    setStatus(ALL_VALUE);
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          project === ALL_VALUE ||
          (u.assignedProjects ?? []).some((p) => String(p.id) === project),
      ),
    [users, project],
  );

  const onFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  const onOrgChange = (value: string) => {
    setOrg(value);
    setRole(ALL_VALUE);
    setPage(1);
  };

  const handleDelete = () => {
    if (!deleteTarget || !canDelete) return;
    const target = deleteTarget;
    deleteUser.mutate(target.id, {
      onSuccess: () => {
        if (users.length === 1 && page > 1) setPage((p) => p - 1);
        setDeleteTarget(null);
      },
    });
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onToggleActive: canUpdate
          ? (u) => toggleStatus.mutate(u.id)
          : undefined,
        onView: canView ? (u) => navigate(`/users/${u.id}`) : undefined,
        onEdit: canUpdate ? (u) => navigate(`/users/${u.id}/edit`) : undefined,
        onDelete: canDelete ? setDeleteTarget : undefined,
      }),
    [navigate, toggleStatus.mutate, canView, canUpdate, canDelete],
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/administration" },
            { label: "Users", href: "/users" },
          ]}
        />

        <PageHeader
          title="User Management"
          description="Manage NEA, Consultant, Contractor user accounts and access"
          action={
            canCreate
              ? {
                  label: "Add User",
                  icon: FiPlus,
                  onClick: () => navigate("/users/add"),
                }
              : undefined
          }
        />

        <div
          className={cn(
            "mt-6 rounded-lg border border-gray-200 bg-white px-3.5 py-5",
            isForbidden && "pointer-events-none opacity-60",
          )}
          aria-disabled={isForbidden}
          inert={isForbidden}
        >
          {/* <div className="grid grid-cols-[1.3fr_1fr_0.9fr_1.3fr_0.9fr_auto] items-center gap-3"> */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr_auto] items-center gap-3">
            <SearchInput
              value={search}
              onChange={onFilterChange(setSearch)}
              placeholder="Search by name, email or username"
            />
            <FilterSelect
              value={org}
              onChange={onOrgChange}
              options={orgOptions}
              allLabel="All Organizations"
            />
            <FilterSelect
              value={role}
              onChange={onFilterChange(setRole)}
              options={roleOptions}
              allLabel="All Roles"
            />
            {/* <FilterSelect
              value={project}
              onChange={onFilterChange(setProject)}
              options={[]}
              allLabel="All Projects/Packages"
              emptyMessage="No projects available yet"
            /> */}
            <FilterSelect
              value={status}
              onChange={onFilterChange(setStatus)}
              options={STATUS_OPTIONS}
              allLabel="All Status"
            />

            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-auto cursor-pointer px-2 text-sm font-medium text-buttonBg hover:bg-transparent hover:text-buttonBg active:bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-col">
        {isForbidden ? (
          <NoPermission message="You don't have permission to view users." />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            loading={isLoading}
            fetching={isFetching}
            rowKey={(u) => String(u.id)}
            emptyMessage="No users found"
            pagination={{
              page,
              pageSize: PAGE_SIZE,
              total,
              onPageChange: setPage,
              itemLabel: "Users",
            }}
          />
        )}
      </div>

      <ConfirmAlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this user?"
        description={`Are you sure you want to delete ${deleteTarget?.fullName ?? "this user"}? The deleted user's data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserManagement;
