import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { FiCheck, FiPlus } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import DataTable from "@/component/userPages/DataTable";
import DarkButton from "@/component/common/DarkButton";
import LightButton from "@/component/common/LightButton";
import { getPackageColumns } from "@/component/tableColumns/packageColumns";
import StatusBadge from "./StatusBadge";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
  type IPackage,
} from "@/type/project.type";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { useProject } from "@/action/useProjects";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useDeletePackage, useUpdatePackageStatus } from "@/action/usePackages";
import DatePicker from "@/component/common/DatePicker";
import { format } from "date-fns";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import NoPermission from "@/component/userPages/NoPermission";

const Info = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div>
    <p className="text-xs text-[#6E8295]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value || "—"}</p>
  </div>
);

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteTarget, setDeleteTarget] = useState<IPackage | null>(null);
  const [extendedDate, setExtendedDate] = useState(""); // picker value
  const [savedExtendedDate, setSavedExtendedDate] = useState("");

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.PROJECT.VIEW);
  const canUpdateProject = can(PERMISSIONS.PROJECT.UPDATE);
  const canCreatePackage = can(PERMISSIONS.PACKAGE.CREATE);
  const canViewPackage = can(PERMISSIONS.PACKAGE.VIEW);
  const canUpdatePackage = can(PERMISSIONS.PACKAGE.UPDATE);
  const canDeletePackage = can(PERMISSIONS.PACKAGE.DELETE);

  const { data: projectRes, isLoading } = useProject(Number(id), {
    enabled: canView,
  });
  const project = projectRes?.data;

  const deletePackage = useDeletePackage();
  const updatePackageStatus = useUpdatePackageStatus();

  const packages: IPackage[] = useMemo(
    () =>
      (project?.packages ?? []).map((p) => ({
        id: p.id,
        projectId: project?.code ?? "",
        number: p.code,
        name: p.name,
        type: p.packageType?.name ?? "-",
        contractor: p.contractor?.name ?? "-",
        consultant:
          p.consultant?.orgName ??
          p.project?.consultant?.orgName ??
          project?.consultant?.orgName ??
          "-",
        region: p.region?.name ?? project?.region?.name ?? "-",
        startDate: p.startDate ?? "-",
        completion: p.approxCompletionDate ?? "-",
        status: p.status,
        description: p.description,
        remarks: p.remarks,
      })),
    [project],
  );

  const activePackages = packages.filter((p) => p.status === "ACTIVE").length;

  const columns = useMemo(
    () =>
      getPackageColumns({
        onToggleActive: canUpdatePackage
          ? (pkg, active) =>
              updatePackageStatus.mutate({
                packageId: pkg.id,
                data: { status: active ? "ACTIVE" : "INACTIVE" },
              })
          : undefined,
        onView: canViewPackage
          ? (pkg) => navigate(`/packages/${pkg.id}`)
          : undefined,
        onEdit: canUpdatePackage
          ? (pkg) => navigate(`/packages/${pkg.id}/edit`)
          : undefined,
        onDelete: canDeletePackage ? setDeleteTarget : undefined,
      }),
    [
      navigate,
      updatePackageStatus,
      canViewPackage,
      canUpdatePackage,
      canDeletePackage,
    ],
  );

  const handleExtendSubmit = () => {
    if (!extendedDate || !canUpdateProject) return;
    setSavedExtendedDate(extendedDate); // TODO: replace with API call
    setExtendedDate("");
  };

  if (permLoading)
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (!canView)
    return (
      <NoPermission message="You don't have permission to view projects." />
    );

  if (isLoading) {
    return (
      <div className="flex min-h-75 flex-1 flex-col items-center justify-center gap-3 text-slate-500">
        <AiOutlineLoading3Quarters className="size-6 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mt-10">
        <p className="text-gray-600">This project could not be found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Project", href: "/projects" },
            { label: project.name },
          ]}
        />
        <PageHeader
          title={project.name}
          description="Project profile and its associated packages."
        />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-8">
        <div className="grid items-stretch gap-6 xl:grid-cols-[1.75fr_1fr]">
          {/* Project information */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Project information
              </h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                {canUpdateProject && (
                  <LightButton
                    className="h-10 w-auto px-5 text-sm"
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                  >
                    Edit project
                  </LightButton>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <Info label="Project code" value={project.code} />
              <Info label="Consultant" value={project.consultant?.orgName} />
              <Info label="Start date" value={project.startDate ?? undefined} />
              <Info
                label="Tentative date"
                value={project.approxCompletionDate ?? undefined}
              />
              {savedExtendedDate && (
                <Info label="Extended date" value={savedExtendedDate} />
              )}
              <Info
                label="Status"
                value={
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-1 text-xs font-medium",
                      PROJECT_STATUS_STYLES[project.status],
                    )}
                  >
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                }
              />
            </div>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-slate-900">
                Description
              </h3>
              <p className="mt-4 text-base text-[#6E8295]">
                {project.description || "—"}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900">
                Remarks
              </h3>
              <p className="mt-4 text-base text-[#6E8295]">
                {project.remarks || "—"}
              </p>
            </div>
          </div>

          {/* Project summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Project summary
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 px-5 py-5">
                <p className="text-sm text-[#6E8295]">Package</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {packages.length}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 px-5 py-5">
                <p className="text-sm text-[#6E8295]">Active</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {activePackages}
                </p>
              </div>
            </div>

            <div className="mt-6 border-l-4 border-[#3b6e99] bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Project access controls apply to every linked package and record.
              Package permissions can be narrower.
            </div>

            {canUpdateProject && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-slate-900">
                  Extended date
                </p>
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <DatePicker
                      value={extendedDate}
                      onChange={setExtendedDate}
                      placeholder="Select extended date"
                      defaultMonth={project.approxCompletionDate ?? undefined}
                      disabled={(date) =>
                        !!project.approxCompletionDate &&
                        format(date, "yyyy-MM-dd") <=
                          project.approxCompletionDate
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleExtendSubmit}
                    disabled={!extendedDate}
                    aria-label="Submit extended date"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#0E2E4A] text-white transition-colors hover:bg-[#0E2E4A]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiCheck className="size-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Packages */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Package under this project
          </h2>
          {canCreatePackage && (
            <DarkButton
              icon={FiPlus}
              className="h-10 w-auto gap-2 bg-[#0E2E4A] px-6 text-sm"
              onClick={() => navigate(`/packages/add?projectId=${project.id}`)}
            >
              Add Package
            </DarkButton>
          )}
        </div>

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={packages}
            rowKey={(p) => String(p.id)}
            emptyMessage="No packages under this project"
          />
        </div>
      </div>

      <ConfirmAlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this package?"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this package"}? Its data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={() => {
          if (!deleteTarget || !canDeletePackage) return;
          deletePackage.mutate(deleteTarget.id, {
            onSettled: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

export default ProjectDetails;
