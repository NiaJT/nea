import {
  useDeletePackageType,
  usePackageTypes,
  useTogglePackageTypeStatus,
} from "@/action/usePackageType";
import DarkButton from "@/component/common/DarkButton";
import DataTable from "@/component/userPages/DataTable";
import NoPermission from "@/component/userPages/NoPermission";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { getPackageTypeColumns } from "./PackageTypeColumn";
import type { IPackageType } from "@/type/packageType.type";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { PAGE_SIZE } from "@/constants";

const PackageType = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, error } = usePackageTypes();
  const deletePackageType = useDeletePackageType();
  const isForbidden = isAxiosError(error) && error.response?.status === 403;

  const [deleteTarget, setDeleteTarget] = useState<IPackageType | null>(null);

  const [page, setPage] = useState(1);

  const { mutate: toggleStatus } = useTogglePackageTypeStatus();

  const columns = useMemo(
    () =>
      getPackageTypeColumns({
        onToggle: (p) => toggleStatus(p.id),
        onView: (p) => navigate(`/package-type/${p.id}`),
        onEdit: (p) => navigate(`/package-type/${p.id}/edit`),
        onDelete: setDeleteTarget,
      }),
    [navigate, toggleStatus],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Package types" },
          ]}
        />
        <PageHeader
          title="Package Type"
          description="Maintain the package types."
          actions={
            <div className="flex items-center gap-3">
              <DarkButton
                icon={FiPlus}
                className="h-10 w-auto gap-2 bg-[#0E2E4A] px-6 text-sm"
                onClick={() => navigate("/package-type/add")}
                disabled={isForbidden}
              >
                Add Package Type
              </DarkButton>
            </div>
          }
        />

        <div className="mt-6 flex min-h-0 flex-col">
          {isForbidden ? (
            <NoPermission message="You don't have permission to view package type." />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              loading={isLoading}
              fetching={isFetching}
              rowKey={(p) => String(p.id)}
              emptyMessage="No package type found"
              pagination={{
                page,
                pageSize: PAGE_SIZE,
                total: 1000,
                onPageChange: setPage,
                itemLabel: "Projects",
              }}
            />
          )}
        </div>
      </div>

      <ConfirmAlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this project?"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this project"}? Its data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={() => {
          if (!deleteTarget) return;
          deletePackageType.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

export default PackageType;
