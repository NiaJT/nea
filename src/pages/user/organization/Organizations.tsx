import { useCallback, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { getOrganizationColumns } from "@/component/tableColumns/organizationColumns";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import DataTable from "@/component/userPages/DataTable";
import type { OrganizationFormValues } from "@/validation/organization.schema";
import OrganizationFormDialog from "./OrganizationFormDialog";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useToggleOrganizationStatus,
  useUpdateOrganization,
} from "@/action/useOrganizations";
import type {
  IOrganization,
  IOrganizationPayload,
} from "@/type/organization.type";
import OrganizationDetailDialog from "./OrganizationDetailDialog";
import { isAxiosError } from "axios";
import NoPermission from "@/component/userPages/NoPermission";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

const PAGE_SIZE = 10;

const Organizations = () => {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<IOrganization | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IOrganization | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.ORGANIZATION.VIEW);
  const canCreate = can(PERMISSIONS.ORGANIZATION.CREATE);
  const canUpdate = can(PERMISSIONS.ORGANIZATION.UPDATE);
  const canDelete = can(PERMISSIONS.ORGANIZATION.DELETE);

  const { data, isLoading, isFetching, error } = useOrganizations(
    { page, perPage: PAGE_SIZE },
    { enabled: canView },
  );

  const isForbidden =
    (!permLoading && !canView) ||
    (isAxiosError(error) && error.response?.status === 403);

  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();

  const toggleStatus = useToggleOrganizationStatus();

  const organizations = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((org: IOrganization) => {
    setEditTarget(org);
    setFormOpen(true);
  }, []);

  const openView = useCallback((org: IOrganization) => {
    setViewId(org.id);
    setViewOpen(true);
  }, []);

  const editFromView = (org: IOrganization) => {
    if (!canUpdate) return;
    setViewOpen(false);
    openEdit(org);
  };

  const toggleActive = useCallback(
    (org: IOrganization) => toggleStatus.mutate(org.id),
    [toggleStatus.mutate],
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    deleteOrg.mutate(target.id, {
      onSuccess: () => {
        // deleted the only row on this page -> go back one page
        if (organizations.length === 1 && page > 1) setPage((p) => p - 1);
        setDeleteTarget(null);
      },
    });
  };

  const handleSave = async (values: OrganizationFormValues) => {
    const payload: IOrganizationPayload = {
      name: values.name,
      orgType: values.type as IOrganization["orgType"],
      orgCode: values.code.toUpperCase(),
      contactEmail: values.email,
      contact: values.phone,
      contactPerson: editTarget?.contactPerson ?? "",
      address: editTarget?.address ?? "",
      status: editTarget?.status ?? "ACTIVE",
    };

    try {
      if (editTarget) {
        await updateOrg.mutateAsync({ id: editTarget.id, data: payload });
      } else {
        await createOrg.mutateAsync(payload);
        setPage(1);
      }
      setFormOpen(false);
    } catch {
      // toast is shown by the mutation's onError; keep the dialog open
    }
  };

  const columns = useMemo(
    () =>
      getOrganizationColumns({
        onToggleActive: toggleActive,
        onEdit: openEdit,
        onView: openView,
        onDelete: setDeleteTarget,
        canView,
        canUpdate,
        canDelete,
      }),
    [toggleActive, openEdit, openView, canView, canUpdate, canDelete],
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/administration" },
            { label: "Organizations" },
          ]}
        />
        <PageHeader
          title="Organizations"
          description="Maintain NEA, Consultant, Contractor organizations."
          action={{
            label: "Add Organization",
            icon: FiPlus,
            onClick: openAdd,
            disabled: !canCreate,
          }}
        />
      </div>

      <div className="mt-6 flex min-h-0 flex-col">
        {isForbidden ? (
          <NoPermission message="You don't have permission to view organizations." />
        ) : (
          <DataTable
            columns={columns}
            data={organizations}
            loading={isLoading}
            fetching={isFetching}
            rowKey={(o) => String(o.id)}
            emptyMessage="No organizations found"
            pagination={{
              page,
              pageSize: PAGE_SIZE,
              total,
              onPageChange: setPage,
              itemLabel: "Organizations",
            }}
          />
        )}
      </div>

      <ConfirmAlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this organization?"
        description={`Are you sure you want to delete ${deleteTarget?.orgName ?? "this organization"}? Its data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={handleDelete}
      />

      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={editTarget}
        onSubmit={handleSave}
      />

      <OrganizationDetailDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        orgId={viewId}
        onEdit={editFromView}
        canEdit={canUpdate}
      />
    </div>
  );
};

export default Organizations;
