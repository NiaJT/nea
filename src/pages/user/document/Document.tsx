import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import { format } from "date-fns";
import { isAxiosError } from "axios";

import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import StatCards from "@/component/common/StatCards";
import { Button } from "@/components/ui/button";
import SearchInput from "@/component/userPages/SearchInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import DataTable from "@/component/userPages/DataTable";
import DatePicker from "@/component/common/DatePicker";
import NoPermission from "@/component/userPages/NoPermission";
import { errorToast, successToast } from "@/component/common/Toasts";

import { useDocumentListingStats, useDocuments } from "@/action/useDocuments";
import { useDocumentTypes } from "@/action/useDocumentTypes";
import { useProjects } from "@/action/useProjects";
import requests from "@/helper/requests";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import { MIN_SEARCH_LENGTH } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

import type {
  DocumentStatus,
  IDocumentListItem,
  IProjectWithPackages,
} from "@/type/document.type";
import { getDocumentColumns } from "@/component/tableColumns/documentColumns";

const ALL_VALUE = "all";
const PAGE_SIZE = 10;

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Comments Issued", value: "COMMENTS_ISSUED" },
  { label: "Resubmission Required", value: "RESUBMISSION_REQUIRED" },
  { label: "Review Completed", value: "REVIEW_COMPLETED" },
  { label: "Recommended", value: "RECOMMENDED" },
  { label: "Recommended Approval", value: "RECOMMENDED_APPROVAL" },
  { label: "Recommended Rejection", value: "RECOMMENDED_REJECTION" },
  { label: "Recommended Resubmission", value: "RECOMMENDED_RESUBMISSION" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Superseded", value: "SUPERSEDED" },
  { label: "Archived", value: "ARCHIVED" },
];
const Document = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_VALUE);
  const [projectId, setProjectId] = useState(ALL_VALUE);
  const [packageId, setPackageId] = useState(ALL_VALUE);
  const [documentTypeId, setDocumentTypeId] = useState(ALL_VALUE);
  const [submittedFrom, setSubmittedFrom] = useState<Date | undefined>();
  const [contractorId, setContractorId] = useState(ALL_VALUE);
  const [revision, setRevision] = useState("");
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.DOCUMENT.VIEW);
  const canCreate = can(PERMISSIONS.DOCUMENT.CREATE);
  const canDownload = can(PERMISSIONS.DOCUMENT.DOWNLOAD);

  // Sources for filter dropdowns
  const { data: documentTypesResponse } = useDocumentTypes();
  const { data: projectsResponse } = useProjects({ page: 1, perPage: 100 });
  const debouncedSearch = useDebounce(search.trim(), 500);

  const apiSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const documentTypes = useMemo(
    () => documentTypesResponse?.data ?? [],
    [documentTypesResponse?.data],
  );

  const projects = useMemo<IProjectWithPackages[]>(
    () => (projectsResponse?.data ?? []) as IProjectWithPackages[],
    [projectsResponse?.data],
  );

  const contractorOptions: SelectOption[] = useMemo(() => {
    const seen = new Map<number, string>();
    for (const project of projects) {
      for (const pkg of project.packages ?? []) {
        const c = pkg.contractor;
        if (c && !seen.has(c.id)) seen.set(c.id, c.name);
      }
    }
    return Array.from(seen, ([id, name]) => ({
      label: name,
      value: String(id),
    }));
  }, [projects]);

  // Derived package list: all packages from all projects, deduplicated by id
  const allPackages = useMemo(() => {
    const seen = new Map<number, { id: number; name: string; code: string }>();
    for (const project of projects) {
      for (const pkg of project.packages ?? []) {
        if (!seen.has(pkg.id)) {
          seen.set(pkg.id, { id: pkg.id, name: pkg.name, code: pkg.code });
        }
      }
    }
    return Array.from(seen.values());
  }, [projects]);

  const { data, isLoading, isFetching, error } = useDocuments(
    {
      page,
      per_page: PAGE_SIZE,
      search: apiSearch || undefined,
      status: status === ALL_VALUE ? undefined : (status as DocumentStatus),
      projectId: projectId === ALL_VALUE ? undefined : Number(projectId),
      packageId: packageId === ALL_VALUE ? undefined : Number(packageId),
      documentTypeId:
        documentTypeId === ALL_VALUE ? undefined : Number(documentTypeId),
      contractorId:
        contractorId === ALL_VALUE ? undefined : Number(contractorId),
      submittedFrom: submittedFrom
        ? format(submittedFrom, "yyyy-MM-dd")
        : undefined,
      revision: revision.trim() ? Number(revision.trim()) : undefined,
    },
    { enabled: canView },
  );

  const isForbidden =
    (!permLoading && !canView) ||
    (isAxiosError(error) && error.response?.status === 403);

  const { data: statsResponse } = useDocumentListingStats({ enabled: canView });

  const documents = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  const stats = [
    { label: "Documents", value: statsResponse?.data?.documents ?? 0 },
    { label: "Under review", value: statsResponse?.data?.underReview ?? 0 },
    { label: "Approved", value: statsResponse?.data?.approved ?? 0 },
    {
      label: "Resubmission required",
      value: statsResponse?.data?.resubmissionRequired ?? 0,
    },
  ];

  const documentTypeOptions: SelectOption[] = useMemo(
    () =>
      documentTypes.map((dt) => ({
        label: dt.name,
        value: String(dt.id),
      })),
    [documentTypes],
  );

  const projectOptions: SelectOption[] = useMemo(
    () =>
      projects.map((p) => ({
        label: `${p.code} — ${p.name}`,
        value: String(p.id),
      })),
    [projects],
  );

  const packageOptions: SelectOption[] = useMemo(() => {
    const filteredPackages =
      projectId === ALL_VALUE
        ? allPackages
        : (projects.find((project) => String(project.id) === projectId)
            ?.packages ?? []);

    return filteredPackages.map((pkg) => ({
      label: `${pkg.code} — ${pkg.name}`,
      value: String(pkg.id),
    }));
  }, [projectId, projects, allPackages]);

  const onFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  const clearFilters = () => {
    setSearch("");
    setStatus(ALL_VALUE);
    setProjectId(ALL_VALUE);
    setPackageId(ALL_VALUE);
    setDocumentTypeId(ALL_VALUE);
    setSubmittedFrom(undefined);
    setContractorId(ALL_VALUE);
    setRevision("");
    setPage(1);
  };

  const handleView = useCallback(
    (doc: IDocumentListItem) => navigate(`/documents/${doc.id}`),
    [navigate],
  );

  const handleDownload = useCallback(
    async (doc: IDocumentListItem) => {
      if (!doc.id || !canDownload) return;

      setDownloadingId(doc.id);
      try {
        const response = await requests.document.downloadDocument(doc.id);

        const blob = new Blob([response.data], {
          type:
            typeof response.headers["content-type"] === "string"
              ? response.headers["content-type"]
              : "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);

        let filename = `document-${doc.id}`;
        const contentDisposition = response.headers["content-disposition"];

        if (contentDisposition) {
          const filenameStarMatch = contentDisposition.match(
            /filename\*=UTF-8''([^;\n]*)/i,
          );
          if (filenameStarMatch) {
            filename = decodeURIComponent(filenameStarMatch[1]);
          } else {
            const filenameMatch = contentDisposition.match(
              /filename="?([^"\n]*)"?/i,
            );
            if (filenameMatch) {
              filename = filenameMatch[1];
            }
          }
        }

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => window.URL.revokeObjectURL(url), 1000);

        successToast("Download started", "Your file is downloading.");
      } catch (err) {
        console.error("Download error:", err);
        errorToast("Download failed", "Could not download the document.");
      } finally {
        setDownloadingId(null);
      }
    },
    [canDownload],
  );

  const columns = useMemo(
    () =>
      getDocumentColumns({
        onView: handleView,
        onDownload: handleDownload,
        downloadingId,
        canView,
        canDownload,
      }),
    [handleView, handleDownload, downloadingId, canView, canDownload],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Documents" },
          ]}
        />
        <PageHeader
          title="Document Listing"
          description="Search, manage and trace project documents."
          actions={
            canCreate && (
              <Button
                onClick={() => navigate("/documents/upload")}
                className="h-10 w-auto cursor-pointer gap-2 bg-[#0E2E4A] px-6 text-sm hover:bg-[#0E2E4A]/90"
              >
                <FiPlus className="size-4" />
                Upload Document
              </Button>
            )
          }
        />

        <div className="mt-6">
          <StatCards items={stats} loading={isLoading} />
        </div>

        <div
          className={cn(
            "mt-6 rounded-lg border border-gray-200 bg-white px-3.5 py-5",
            isForbidden && "pointer-events-none opacity-60",
          )}
          aria-disabled={isForbidden}
          inert={isForbidden}
        >
          <div className="flex w-full flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={onFilterChange(setSearch)}
              placeholder="Document number, title or contractor"
              className="w-auto! min-w-0 flex-1"
            />

            <FilterSelect
              value={status}
              onChange={onFilterChange(setStatus)}
              options={STATUS_OPTIONS}
              allLabel="All statuses"
              className="w-43.75! shrink-0"
            />

            <FilterSelect
              value={projectId}
              onChange={(value) => {
                setProjectId(value);
                setPackageId(ALL_VALUE);
                setPage(1);
              }}
              options={projectOptions}
              allLabel="All projects"
              className="w-52! shrink-0"
            />

            <FilterSelect
              value={packageId}
              onChange={onFilterChange(setPackageId)}
              options={packageOptions}
              allLabel="All packages"
              className="w-60! shrink-0"
            />

            <FilterSelect
              value={documentTypeId}
              onChange={onFilterChange(setDocumentTypeId)}
              options={documentTypeOptions}
              allLabel="All types"
              className="w-40! shrink-0"
            />

            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-auto cursor-pointer px-2 text-sm font-medium text-buttonBg hover:bg-transparent hover:text-buttonBg active:bg-transparent"
            >
              Clear
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#718499]">Submitted</span>

            <DatePicker
              value={
                submittedFrom ? format(submittedFrom, "yyyy-MM-dd") : undefined
              }
              onChange={(d) => {
                setSubmittedFrom(d ? new Date(`${d}T00:00:00Z`) : undefined);
                setPage(1);
              }}
              placeholder="From dd/mm/yyyy"
              className="w-45! shrink-0"
            />
            <FilterSelect
              value={contractorId}
              onChange={onFilterChange(setContractorId)}
              options={contractorOptions}
              allLabel="All contractors"
              className="w-43.75! shrink-0"
            />

            <input
              type="text"
              inputMode="numeric"
              value={revision}
              onChange={(e) => {
                setRevision(e.target.value.replace(/[^0-9]/g, ""));
                setPage(1);
              }}
              placeholder="Revision, e.g. 2"
              className="h-10 w-50 rounded-lg border border-[#D7E2EC] bg-white px-3 text-sm text-[#243B51] placeholder:text-[#757575] focus:outline-none focus:ring-1 focus:ring-[#126BA3]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-col">
        {isForbidden ? (
          <NoPermission message="You don't have permission to view documents." />
        ) : (
          <DataTable
            columns={columns}
            data={documents}
            loading={isLoading}
            fetching={isFetching}
            rowKey={(d) => String(d.id)}
            emptyMessage="No documents found"
            pagination={{
              page,
              pageSize: PAGE_SIZE,
              total,
              onPageChange: setPage,
              itemLabel: "Documents",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Document;
