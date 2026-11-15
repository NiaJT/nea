import { Badge } from "@/components/ui/badge";
import type { Column } from "../userPages/DataTable";
import { ORG_STYLES } from "./userColumns";
import StatusBadge from "../userPages/StatusBadge";
import RowActions from "../userPages/RowActions";
import type { IOrganization } from "@/type/organization.type";

interface OrganizationColumnsOptions {
  onToggleActive?: (org: IOrganization, active: boolean) => void;
  onEdit?: (org: IOrganization) => void;
  onView?: (org: IOrganization) => void;
  onDelete?: (org: IOrganization) => void;
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export const ORGNIZATION_OPTIONS = [
  { value: "NEA", label: "NEA" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "CONTRACTOR", label: "Contractor" },
];

export const getOrganizationColumns = ({
  onToggleActive,
  onEdit,
  onView,
  onDelete,
  canView = true,
  canUpdate = true,
  canDelete = true,
}: OrganizationColumnsOptions): Column<IOrganization>[] => [
  {
    key: "name",
    header: "Organization",
    cell: (o) => (
      <span className="text-sm text-gray-600 pl-6">{o.orgName}</span>
    ),
  },
  {
    key: "type",
    header: <div className="text-center">Type</div>,
    cell: (o) => (
      <div className="flex justify-center">
        <Badge
          variant="secondary"
          className={`rounded-full px-3 py-1 text-xs font-normal ${ORG_STYLES[o.orgType]}`}
        >
          {o.orgType}
        </Badge>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    cell: (o) => (
      <span className="text-xs font-medium text-[#000000B2]">
        {o.contactEmail}
      </span>
    ),
  },
  {
    key: "linkedUsers",
    header: <div className="text-center">Linked Users</div>,
    cell: () => <p className="text-center text-xs text-gray-600">{"-"}</p>,
  },
  {
    key: "status",
    header: "Status",
    cell: (o) => (
      <StatusBadge status={o.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"} />
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (org) => (
      <RowActions
        active={org.status === "ACTIVE"}
        onToggleActive={(a) => onToggleActive?.(org, a)}
        onEdit={() => onEdit?.(org)}
        onView={() => onView?.(org)}
        onDelete={() => onDelete?.(org)}
        disableToggle={!canUpdate}
        disableEdit={!canUpdate}
        disableView={!canView}
        disableDelete={!canDelete}
      />
    ),
  },
];
