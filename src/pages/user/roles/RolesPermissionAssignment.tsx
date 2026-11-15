import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuSave } from "react-icons/lu";
import DarkButton from "@/component/common/DarkButton";
import LightButton from "@/component/common/LightButton";
import { Checkbox } from "@/components/ui/checkbox";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { useRole, useUpdateRolePermissions } from "@/action/useRoles";
import { usePermissionModules } from "@/action/usePermissionModules";
import type { IRole, IPermissionModule } from "@/type/role.type";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import NoPermission from "@/component/userPages/NoPermission";

const RolePermissionAssignment = () => {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId: string }>();
  const numericRoleId = roleId ? Number(roleId) : undefined;
  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.ROLE.VIEW);

  const { data: roleResponse, isLoading: roleLoading } = useRole(
    numericRoleId,
    {
      enabled: canView,
    },
  );
  const { data: modulesResponse, isLoading: modulesLoading } =
    usePermissionModules();

  const role = roleResponse?.data;
  const modules = useMemo(
    () => modulesResponse?.data ?? [],
    [modulesResponse?.data],
  );

  if (permLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }
  if (!canView) {
    return <NoPermission message="You don't have permission to view roles." />;
  }

  if (roleLoading || modulesLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }
  if (!role) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">Role not found.</p>
      </div>
    );
  }

  return (
    <PermissionForm
      key={role.id}
      role={role}
      modules={modules}
      onCancel={() => navigate("/roles")}
    />
  );
};

interface PermissionFormProps {
  role: IRole;
  modules: IPermissionModule[];
  onCancel: () => void;
}

const PermissionForm = ({ role, modules, onCancel }: PermissionFormProps) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(role.permissions.map((p) => p.id)),
  );

  const { can } = usePermissions();
  const canUpdate = can(PERMISSIONS.ROLE.UPDATE);

  const { mutate: updatePermissions, isPending: isSaving } =
    useUpdateRolePermissions();

  const toggle = (permissionId: number) => {
    if (!canUpdate) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) next.delete(permissionId);
      else next.add(permissionId);
      return next;
    });
  };

  const handleSave = () => {
    if (!canUpdate) return;

    updatePermissions(
      {
        id: role.id,
        data: { permissionIds: Array.from(selected) },
      },
      {
        onSuccess: () => {
          navigate("/roles");
        },
      },
    );
  };

  const COLUMN_ORDER = [
    "Create",
    "Update",
    "Delete",
    "View",
    "Preview",
    "Review",
    "Download",
  ];

  const columnNames = useMemo(() => {
    const names = new Set<string>();
    modules.forEach((m) => m.permissions.forEach((p) => names.add(p.name)));
    const all = Array.from(names);
    return [
      ...COLUMN_ORDER.filter((n) => names.has(n)),
      ...all.filter((n) => !COLUMN_ORDER.includes(n)),
    ];
  }, [modules]);

  return (
    <div className="flex h-full min-h-0 flex-col px-2 py-1">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/administration" },
            { label: "Role & Permission", href: "/roles" },
            { label: role.name },
          ]}
        />
        <PageHeader
          title="Role & Permission Assignment"
          description={`Configure module and function-level access for ${role.name}`}
        />
      </div>

      {/* Scroll container — everything vertical and horizontal happens here */}
      <div className="mt-6 min-h-0 flex-1 overflow-auto rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 h-[40.5px] w-64 border-b border-[#E9EFF4] bg-[#F7FAFC] px-2.5 py-3 text-left text-xs font-semibold text-[#6E8295]">
                Module
              </th>
              {columnNames.map((name) => (
                <th
                  key={name}
                  className="h-[40.5px] border-b border-[#E9EFF4] bg-[#F7FAFC] px-2.5 py-3 text-left text-xs font-semibold text-[#6E8295]"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id}>
                <td className="sticky left-0 z-10 h-11.5 w-64 border-b border-[#E9EFF4] bg-white px-2.5 py-3 text-[13px] text-[#17283C]">
                  {module.name}
                </td>
                {columnNames.map((name) => {
                  const perm = module.permissions.find((p) => p.name === name);
                  return (
                    <td
                      key={name}
                      className="h-11.5 border-b border-[#E9EFF4] bg-white px-2.5 py-3"
                    >
                      {perm && (
                        <Checkbox
                          checked={selected.has(perm.id)}
                          disabled={!canUpdate}
                          onCheckedChange={() => toggle(perm.id)}
                          className="size-4 cursor-pointer rounded-xs border border-gray-400 data-checked:border-[#17669D] data-checked:bg-[#17669D] data-checked:text-white disabled:cursor-not-allowed"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 flex-row justify-end gap-4 pt-6">
        <LightButton
          type="button"
          onClick={onCancel}
          className="h-11 w-56.5 border-buttonBg text-buttonBg"
        >
          Cancel
        </LightButton>
        <DarkButton
          type="button"
          icon={LuSave}
          onClick={handleSave}
          loading={isSaving}
          disabled={!canUpdate}
          title={canUpdate ? undefined : "You don't have permission"}
          loadingText="Saving..."
          className="h-11 w-56.5 bg-buttonBg hover:bg-buttonBg/90"
        >
          Save Permission
        </DarkButton>
      </div>
    </div>
  );
};

export default RolePermissionAssignment;
