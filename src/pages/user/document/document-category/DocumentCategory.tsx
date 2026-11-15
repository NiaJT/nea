import DarkButton from "@/component/common/DarkButton";
import NoPermission from "@/component/userPages/NoPermission";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";

import { useMemo, useState } from "react";

import { isAxiosError } from "axios";
import DataTable from "@/component/userPages/DataTable";

import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { getDocumentCategoryColumns } from "./DocumentCategoryColumn";
import {
  useDeleteDocumentCategory,
  useDocumentCategories,
  useToggleDocumentCategoryStatus,
} from "@/action/useDocumentCategory";
import type { IDocumentCategory } from "@/type/packageCategory.type";

const DocumentCategory = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, error } = useDocumentCategories();
  const toggleStatus = useToggleDocumentCategoryStatus();
  const deleteDocumentCategory = useDeleteDocumentCategory();

  const isForbidden = isAxiosError(error) && error.response?.status === 403;

  const [deleteTarget, setDeleteTarget] = useState<IDocumentCategory | null>(
    null,
  );

  const columns = useMemo(
    () =>
      getDocumentCategoryColumns({
        onToggle: (x) => toggleStatus.mutate(x.id),
        onView: (x) => navigate(`/document-category/${x.id}`),
        onEdit: (x) => navigate(`/document-category/${x.id}/edit`),
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
            { label: "Document categories" },
          ]}
        />
        <PageHeader
          title="Document Category"
          description="Maintain the document categories."
          actions={
            <div className="flex items-center gap-3">
              <DarkButton
                icon={FiPlus}
                className="h-10 w-auto gap-2 bg-[#0E2E4A] px-6 text-sm"
                onClick={() => navigate("/document-category/add")}
                disabled={isForbidden}
              >
                Add Document Category
              </DarkButton>
            </div>
          }
        />

        <div className="mt-6 flex min-h-0 flex-col">
          {isForbidden ? (
            <NoPermission message="You don't have permission to view document category." />
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
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this document category"}? Its data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteDocumentCategory.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

export default DocumentCategory;
