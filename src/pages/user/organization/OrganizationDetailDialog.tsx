import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiEdit2,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import FormDialog from "@/component/common/FormDialog";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import StatusBadge from "@/component/userPages/StatusBadge";
import { ORG_STYLES } from "@/component/tableColumns/userColumns";
import { useOrganization } from "@/action/useOrganizations";
import type { IOrganization } from "@/type/organization.type";
import { cn } from "@/lib/utils";

interface OrganizationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: number | null;
  onEdit?: (org: IOrganization) => void;
  canEdit?: boolean;
}

interface DetailItemProps {
  icon: IconType;
  label: string;
  children: ReactNode;
}

const DetailItem = ({ icon: Icon, label, children }: DetailItemProps) => (
  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-slate-50/60 p-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#6E8295] shadow-sm ring-1 ring-gray-100">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#6E8295]">{label}</p>
      <p className="mt-0.5 wrap-break-word text-sm font-medium text-gray-800">
        {children || "-"}
      </p>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-200" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-18 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </div>
  </div>
);

const OrganizationDetailDialog = ({
  open,
  onOpenChange,
  orgId,
  onEdit,
  canEdit = true,
}: OrganizationDetailDialogProps) => {
  const { data, isLoading, isError, refetch, isFetching } = useOrganization(
    open && orgId !== null ? orgId : undefined,
  );
  const org = data?.data;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Organization details"
    >
      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !org ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-sm text-slate-500">
            Could not load organization details.
          </p>
          <LightButton
            type="button"
            className="w-36"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying..." : "Try again"}
          </LightButton>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
                {org.orgName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {org.orgName}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`rounded-full px-3 py-1 text-xs font-normal ${ORG_STYLES[org.orgType]}`}
                  >
                    {org.orgType}
                  </Badge>
                  <StatusBadge
                    status={org.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailItem icon={FiHash} label="Organization Code">
              {org.orgCode}
            </DetailItem>
            <DetailItem icon={FiUser} label="Contact Person">
              {org.contactPerson}
            </DetailItem>
            <DetailItem icon={FiMail} label="Contact Email">
              {org.contactEmail}
            </DetailItem>
            <DetailItem icon={FiPhone} label="Contact Phone">
              {org.contact}
            </DetailItem>
            <div className="md:col-span-2">
              <DetailItem icon={FiMapPin} label="Address">
                {org.address}
              </DetailItem>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <LightButton
              type="button"
              className="w-36"
              onClick={() => onOpenChange(false)}
            >
              Close
            </LightButton>
            {onEdit && (
              <span
                className={canEdit ? undefined : "cursor-not-allowed"}
                title={canEdit ? undefined : "You don't have permission"}
              >
                <DarkButton
                  type="button"
                  icon={FiEdit2}
                  className={cn(
                    "w-36 gap-2",
                    !canEdit && "pointer-events-none opacity-40",
                  )}
                  disabled={!canEdit}
                  onClick={() => canEdit && onEdit(org)}
                >
                  Edit
                </DarkButton>
              </span>
            )}
          </div>
        </div>
      )}
    </FormDialog>
  );
};

export default OrganizationDetailDialog;
