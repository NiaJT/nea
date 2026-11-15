import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { LuUsers, LuPlus } from "react-icons/lu";
import { FaUserLock } from "react-icons/fa";
import FilterSelect, {
  ALL_VALUE,
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import SearchInput from "@/component/userPages/SearchInput";
import RoleFormDialog from "./RoleFormDialog";
import { useRoles, useCreateRole, useUpdateRole } from "@/action/useRoles";
import { useOrganizations } from "@/action/useOrganizations";
import type { IRole, IOrganizationRoleGroup } from "@/type/role.type";
import type { RoleFormValues } from "@/validation/role.schema";
import type { IOrganization } from "@/type/organization.type";
import RoleCardMenu from "@/component/rolePages/roleCardMenu";
import { isAxiosError } from "axios";
import { cn } from "@/lib/utils";
import NoPermission from "@/component/userPages/NoPermission";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

const PAGE = 1;
const PER_PAGE = 20;
const ORG_PER_PAGE = 100;

const RolesPermission = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState<string>(ALL_VALUE);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.ROLE.VIEW);
  const canCreate = can(PERMISSIONS.ROLE.CREATE);
  const canUpdate = can(PERMISSIONS.ROLE.UPDATE);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useRoles(
    {
      page: PAGE,
      perPage: PER_PAGE,
      name: search.trim() || undefined,
      organizationId:
        organization === ALL_VALUE ? undefined : Number(organization),
    },
    { enabled: canView },
  );

  const isForbidden =
    (!permLoading && !canView) ||
    (isAxiosError(error) && error.response?.status === 403);

  const { data: orgsResponse } = useOrganizations({
    page: 1,
    perPage: ORG_PER_PAGE,
  });

  const roles: IRole[] = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

  const groups: IOrganizationRoleGroup[] = useMemo(() => {
    const map = new Map<number, IOrganizationRoleGroup>();
    for (const role of roles) {
      if (!map.has(role.organizationId)) {
        map.set(role.organizationId, {
          organizationId: role.organizationId,
          organizationName: role.organizationName,
          roles: [],
        });
      }
      map.get(role.organizationId)!.roles.push(role);
    }
    return Array.from(map.values());
  }, [roles]);

  const totalRoles = response?.pagination?.total ?? roles.length;

  const organizationOptions: SelectOption[] = useMemo(
    () =>
      (orgsResponse?.data ?? []).map((org: IOrganization) => ({
        label: org.orgName,
        value: String(org.id),
      })),
    [orgsResponse],
  );

  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();

  const clearFilters = () => {
    setSearch("");
    setOrganization(ALL_VALUE);
  };

  const handleRoleClick = (role: IRole) => {
    navigate(`/roles/${role.id}`);
  };

  const openAddDialog = () => {
    if (!canCreate) return;
    setEditingRole(null);
    setDialogOpen(true);
  };

  const openEditDialog = (role: IRole) => {
    if (!canUpdate) return;
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingRole(null);
  };

  const handleSubmit = (values: RoleFormValues): Promise<void> => {
    const payload = {
      name: values.name,
      description: values.description,
      organizationId: Number(values.organizationId),
    };

    return new Promise<void>((resolve, reject) => {
      if (editingRole) {
        updateRole(
          { id: editingRole.id, data: payload },
          {
            onSuccess: () => {
              handleDialogClose(false);
              resolve();
            },
            onError: (err) => reject(err),
          },
        );
      } else {
        createRole(payload, {
          onSuccess: () => {
            handleDialogClose(false);
            resolve();
          },
          onError: (err) => reject(err),
        });
      }
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Fixed header block */}
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Role & Permission" },
          ]}
        />

        <PageHeader
          title="Roles & Permission"
          description="Define role and configure models/function-level access for NEA, Consultant and Contractor."
          action={{
            label: "Add Role",
            onClick: openAddDialog,
            icon: LuPlus,
            disabled: !canCreate,
          }}
        />

        {/* Search + filter bar */}
        <div
          className={cn(
            "mt-6 rounded-lg border border-gray-200 bg-white px-3.5 py-5",
            isForbidden && "pointer-events-none opacity-60",
          )}
          aria-disabled={isForbidden}
          inert={isForbidden}
        >
          <div className="flex w-full flex-row items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by role name"
              className="w-auto! min-w-0 flex-1"
            />

            <FilterSelect
              value={organization}
              onChange={setOrganization}
              options={organizationOptions}
              allLabel="All Organizations"
              className="w-43.75! shrink-0"
            />

            <span className="shrink-0 whitespace-nowrap px-2 text-sm text-black">
              {totalRoles} roles configured
            </span>

            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 cursor-pointer rounded-none border-0 bg-transparent px-2 text-sm font-medium text-buttonBg shadow-none outline-none hover:bg-transparent hover:text-buttonBg active:bg-transparent"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable groups */}
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
        {isForbidden ? (
          <NoPermission message="You don't have permission to view roles." />
        ) : isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading roles…
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-600">
            Failed to load roles.
          </div>
        ) : groups.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No roles found.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <section
                key={group.organizationId}
                className="flex w-full flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-black">
                    {group.organizationName}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {group.roles.length} Role
                  </span>
                </div>

                <div className="grid w-full grid-cols-2 items-stretch gap-6 lg:grid-cols-3">
                  {group.roles.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      handleRoleClick={handleRoleClick}
                      onEdit={() => openEditDialog(role)}
                      canUpdate={canUpdate}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        role={editingRole}
        organizationId={
          organization === ALL_VALUE ? undefined : Number(organization)
        }
        organizationOptions={organizationOptions}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

const RoleCard = ({
  role,
  handleRoleClick,
  onEdit,
  canUpdate,
}: {
  role: IRole;
  onEdit: () => void;
  handleRoleClick: (role: IRole) => void;
  canUpdate: boolean;
}) => {
  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex h-full w-full flex-col items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 pb-6 transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#164E63]"
    >
      <h3 className="pr-20 text-base font-medium text-black">
        {role.name ?? "Untitled role"}
      </h3>

      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex flex-row flex-wrap items-start gap-1">
          <span className="inline-flex h-5.5 items-center justify-center gap-1 rounded-2xl border border-sky-100 bg-sky-50 px-2 text-center text-sm text-sky-900">
            {role.organizationName ?? "—"}
          </span>
        </div>

        <p className="w-full text-sm text-gray-600">{role.description ?? ""}</p>
      </div>

      <div className="mt-auto flex w-full flex-col gap-4">
        {/* Users + modules row */}
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex min-w-0 flex-row items-center gap-1">
            <LuUsers className="size-3 shrink-0 text-[#8392AA]" />
            <span
              className="truncate text-sm text-[#8392AA]"
              title="User count will be available once the backend exposes it"
            >
              {role.users ?? "0"} Users
            </span>
          </div>

          <span
            className="shrink-0 text-sm text-[#8392AA]"
            title="Module count will be available once the backend exposes it"
          >
            {role.modulesConfigured ?? "0"} modules configured
          </span>
        </div>

        {/* Footer */}
        <div className="flex w-full flex-row items-center justify-between border-t border-gray-100 pt-2">
          <button
            type="button"
            disabled={!canUpdate}
            title={canUpdate ? undefined : "You don't have permission"}
            onClick={() => handleRoleClick(role)}
            onKeyDown={(e) => e.stopPropagation()}
            className="cursor-pointer text-sm font-medium text-gray-700 hover:text-buttonBg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-gray-700"
          >
            Edit Permission
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <RoleCardMenu onEdit={onEdit} disableEdit={!canUpdate} />
          </div>
        </div>
      </div>

      <span className="absolute right-4 top-4 inline-flex h-5.5 items-center justify-center gap-1 rounded-2xl border border-gray-100 bg-gray-50 px-2">
        <FaUserLock className="size-3 shrink-0 text-[#8392AA]" />
        <span className="text-sm text-[#8392AA]">
          {role.organizationName ?? "—"}
        </span>
      </span>
    </article>
  );
};

export default RolesPermission;
