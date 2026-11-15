import DarkButton from "@/component/common/DarkButton";
import NoPermission from "@/component/userPages/NoPermission";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { getDocumentTypeColumns } from "./DocumentTypeColumn";
import { useMemo, useState } from "react";

import {
  useDeleteDocumentType,
  useDocumentTypes,
  useToggleDocumentTypeStatus,
} from "@/action/useDocumentTypes";
import { isAxiosError } from "axios";
import DataTable from "@/component/userPages/DataTable";
import type { IDocumentTypeOption } from "@/type/document.type";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";

const DocumentType = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, error } = useDocumentTypes();
  const toggleStatus = useToggleDocumentTypeStatus();
  const deleteDocumentType = useDeleteDocumentType();

  const isForbidden = isAxiosError(error) && error.response?.status === 403;

  const [deleteTarget, setDeleteTarget] = useState<IDocumentTypeOption | null>(
    null,
  );

  const columns = useMemo(
    () =>
      getDocumentTypeColumns({
        onToggle: (x) => toggleStatus.mutate(x.id),
        onView: (x) => navigate(`/document-type/${x.id}`),
        onEdit: (x) => navigate(`/document-type/${x.id}/edit`),
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
            { label: "Document types" },
          ]}
        />
        <PageHeader
          title="Document Type"
          description="Maintain the document types."
          actions={
            <div className="flex items-center gap-3">
              <DarkButton
                icon={FiPlus}
                className="h-10 w-auto gap-2 bg-[#0E2E4A] px-6 text-sm"
                onClick={() => navigate("/document-type/add")}
                disabled={isForbidden}
              >
                Add Document Type
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
              emptyMessage="No projects found"
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
          deleteDocumentType.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

export default DocumentType;
