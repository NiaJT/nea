import { Badge } from "@/components/ui/badge";
import type { Column } from "@/component/userPages/DataTable";
import StatusBadge from "../userPages/StatusBadge";
import RowActions from "../userPages/RowActions";
import type { IUser } from "@/type/user.type";

export type Org = "NEA" | "CONSULTANT" | "CONTRACTOR";

export const ORG_STYLES: Record<Org, string> = {
  NEA: "bg-sky-50 text-cyan-900 border-sky-100",
  CONSULTANT: "bg-blue-50 text-blue-800 border-blue-100",
  CONTRACTOR: "bg-violet-50 text-violet-700 border-violet-100",
};

interface UserColumnsOptions {
  onToggleActive?: (user: IUser, active: boolean) => void;
  onEdit?: (user: IUser) => void;
  onView?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const DEFAULT_ORG_STYLE = "bg-gray-50 text-gray-700 border-gray-100";

export const getUserColumns = ({
  onToggleActive,
  onEdit,
  onView,
  onDelete,
  canView = true,
  canUpdate = true,
  canDelete = true,
}: UserColumnsOptions): Column<IUser>[] => [
  {
    key: "name",
    header: "Name",
    className: "w-[190px] pl-6",
    cell: (u) => (
      <div>
        <p className="text-sm text-gray-600">{u.fullName}</p>
        <p className="text-xs text-[#00000080]">{u.username ?? "-"}</p>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email/Username",
    cell: (u) => (
      <span className="text-xs font-medium text-[#000000B2]">{u.email}</span>
    ),
  },
  {
    key: "organization",
    header: <div className="text-center">Organization</div>,
    cell: (u) => (
      <div className="flex justify-center">
        {u.organizationName ? (
          <Badge
            variant="secondary"
            className={`rounded-full px-3 py-1 text-xs font-normal ${
              ORG_STYLES[u.organizationName as Org] ?? DEFAULT_ORG_STYLE
            }`}
          >
            {u.organizationName}
          </Badge>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </div>
    ),
  },
  {
    key: "role",
    header: <div className="pl-6">Primary Role</div>,
    cell: (u) => (
      <p className="mx-auto max-w-37.5 text-center text-xs text-gray-600">
        {u.roleName}
      </p>
    ),
  },
  // {
  //   key: "projects",
  //   header: <div className="leading-6">Assigned Project/Package</div>,
  //   cell: (u) => {
  //     const projects = u.assignedProjects ?? [];
  //     if (projects.length === 0) {
  //       return <span className="text-xs text-gray-400">-</span>;
  //     }
  //     return (
  //       <div className="flex flex-wrap gap-1.5">
  //         {projects.slice(0, 2).map((p) => (
  //           <Badge
  //             key={p}
  //             variant="secondary"
  //             className="rounded-full border-gray-100 bg-gray-50 px-3 py-1 text-xs font-normal text-gray-800"
  //           >
  //             {p}
  //           </Badge>
  //         ))}
  //         {projects.length > 2 && (
  //           <span className="text-xs text-gray-500">
  //             +{projects.length - 2}
  //           </span>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    key: "packageCount",
    header: <div className="text-center">Packages</div>,
    cell: (u) => (
      <p className="text-center text-xs text-gray-600">{u.packageCount}</p>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (u) => <StatusBadge status={u.userStatus} />,
  },
  {
    key: "lastLogin",
    header: "Last Login",
    cell: (u) => (
      <p className="w-20 text-xs leading-5 text-gray-600">
        {(u.lastLogin ?? "Never").replace(", ", ",\n")}
      </p>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (u) => (
      <RowActions
        active={u.userStatus === "ACTIVE"}
        onToggleActive={(active) => onToggleActive?.(u, active)}
        onEdit={() => onEdit?.(u)}
        onView={() => onView?.(u)}
        onDelete={() => onDelete?.(u)}
        disableToggle={!canUpdate}
        disableEdit={!canUpdate}
        disableView={!canView}
        disableDelete={!canDelete}
      />
    ),
  },
];
