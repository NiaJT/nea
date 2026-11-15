import { useNavigate, useParams } from "react-router";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import LightButton from "@/component/common/LightButton";
import StatusBadge from "@/pages/user/project/StatusBadge";
import { usePackage } from "@/action/usePackages";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PACKAGE_STATUS_LABELS } from "@/type/project.type";
import { useState } from "react";
import DatePicker from "@/component/common/DatePicker";
import { format } from "date-fns";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import NoPermission from "@/component/userPages/NoPermission";

const RELATED_RECORDS = [
  { label: "Documents & tracking" },
  { label: "Safeguards & corrective actions" },
  { label: "Pour cards & cube tests" },
  { label: "Invoices & guarantees" },
  { label: "Meetings & field staff" },
];

const Info = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-[#6E8295]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value || "—"}</p>
  </div>
);

const PackageDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.PACKAGE.VIEW);
  const canUpdate = can(PERMISSIONS.PACKAGE.UPDATE);

  const { data: pkgRes, isLoading } = usePackage(Number(id), {
    enabled: canView,
  });
  const pkg = pkgRes?.data;

  const [extendedDate, setExtendedDate] = useState("");
  const [savedExtendedDate, setSavedExtendedDate] = useState("");

  const handleExtendSubmit = () => {
    if (!extendedDate) return;
    setSavedExtendedDate(extendedDate); // TODO: replace with API call
    setExtendedDate("");
  };

  if (permLoading)
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  if (!canView)
    return (
      <NoPermission message="You don't have permission to view packages." />
    );

  if (isLoading) {
    return (
      <div className="flex min-h-75 flex-1 items-center justify-center text-slate-500">
        <AiOutlineLoading3Quarters className="size-6 animate-spin" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mt-10 flex flex-col items-start gap-4">
        <p className="text-gray-600">This package could not be found.</p>
        <LightButton className="w-40" onClick={() => navigate("/projects")}>
          Back to Projects
        </LightButton>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            {
              label: "Projects",
              href: pkg.project ? `/projects/${pkg.project.id}` : "/projects",
            },
            { label: pkg.name },
          ]}
        />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="my-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#126BA3] transition-colors hover:text-[#0E2E4A]"
        >
          <FiArrowLeft className="size-4" />
          Back to projects
        </button>
        <PageHeader
          title={pkg.name}
          description="Project profile and its associated packages."
        />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-8">
        <div className="grid items-stretch gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Package information */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Package information
              </h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={pkg.status} />
                <LightButton
                  className="h-10 w-auto px-5 text-sm"
                  onClick={() => navigate(`/packages/${pkg.id}/edit`)}
                  disabled={!canUpdate}
                >
                  Edit package
                </LightButton>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {/* <Info
                label="Package ID"
                value={`PKG-${String(pkg.id).padStart(3, "0")}`}
              /> */}
              <Info label="Package number" value={pkg.code} />
              <Info label="Parent project" value={pkg.project?.name} />
              <Info label="Package type" value={pkg.packageType?.name} />
              <Info label="Contractor" value={pkg.contractor?.name} />
              <Info
                label="Consultant"
                value={pkg.project?.consultant?.orgName}
              />
              <Info label="Region" value={pkg.project?.region?.name ?? "-"} />
              <Info label="Start date" value={pkg.startDate ?? undefined} />
              <Info
                label="Tentative date"
                value={pkg.approxCompletionDate ?? undefined}
              />
              {savedExtendedDate && (
                <Info label="Extended date" value={savedExtendedDate} />
              )}
              <Info label="Status" value={PACKAGE_STATUS_LABELS[pkg.status]} />
            </div>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-slate-900">
                Description / scope
              </h3>
              <p className="mt-4 text-base text-[#6E8295]">
                {pkg.description || "—"}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900">
                Remarks
              </h3>
              <p className="mt-4 text-base text-[#6E8295]">
                {pkg.remarks || "—"}
              </p>
            </div>
          </div>

          {/* Related records */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Related records
            </h2>

            <div className="mt-5 border-l-4 border-[#3b6e99] bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Links below represent navigation to other PMS modules, filtered by
              this project and package.
            </div>

            <ul className="mt-2">
              {RELATED_RECORDS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between border-b border-gray-200 py-3.5 text-sm text-slate-800"
                >
                  <span>{r.label}</span>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 text-sm text-buttonBg"
                  >
                    View <FiArrowRight className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {(() => {
              const minDate =
                savedExtendedDate || pkg.approxCompletionDate || "";
              return (
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
                        defaultMonth={minDate || undefined}
                        disabled={(date) =>
                          !!minDate && format(date, "yyyy-MM-dd") <= minDate
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
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
