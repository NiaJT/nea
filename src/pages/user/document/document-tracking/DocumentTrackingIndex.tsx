import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FiPlus } from "react-icons/fi";
import { format } from "date-fns";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import SearchInput from "@/component/userPages/SearchInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import DataTable from "@/component/userPages/DataTable";
import DatePicker from "@/component/common/DatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getDocumentTrackingColumns } from "@/component/tableColumns/documentTrackingColumns";
import { useDocumentTracking } from "@/action/useDocumentTracking";
import { useProjects } from "@/action/useProjects";
import type {
  DocumentStatus,
  DocumentTrackingTab,
  IDocumentTrackingItem,
  IProjectWithPackages,
} from "@/type/document.type";
import { MIN_SEARCH_LENGTH } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

/* URL slug → enum mapping */
const TAB_ROUTES: Record<DocumentTrackingTab, string> = {
  all: "",
  myWork: "my-work",
  awaitingReview: "awaiting-review",
  awaitingContractorResponse: "awaiting-contractor-response",
  awaitingRecommendation: "awaiting-recommendation",
  awaitingDecision: "awaiting-decision",
  overdue: "overdue",
  completed: "completed",
};

const TAB_LABELS: Record<DocumentTrackingTab, string> = {
  all: "All",
  myWork: "My work",
  awaitingReview: "Awaiting Review",
  awaitingContractorResponse: "Awaiting Contractor Response",
  awaitingRecommendation: "Awaiting Recommendation",
  awaitingDecision: "Awaiting Decision",
  overdue: "Overdue",
  completed: "Completed",
};

const slugToTab = (slug?: string): DocumentTrackingTab => {
  if (!slug) return "all";
  const entry = Object.entries(TAB_ROUTES).find(([, s]) => s === slug);
  return (entry?.[0] as DocumentTrackingTab) ?? "all";
};

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
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const DocumentTrackingIndex = () => {
  const navigate = useNavigate();
  const { tab: tabSlug } = useParams<{ tab?: string }>();

  const tab = slugToTab(tabSlug);

  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState(ALL_VALUE);
  const [packageId, setPackageId] = useState(ALL_VALUE);
  const [status, setStatus] = useState(ALL_VALUE);
  const [contractorId, setContractorId] = useState(ALL_VALUE);
  const [reviewerId, setReviewerId] = useState(ALL_VALUE);
  const [submittedDate, setSubmittedDate] = useState<Date | undefined>();
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const apiSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  /* Filter source data */
  const { data: projectsResponse } = useProjects({ page: 1, perPage: 100 });

  const projects = useMemo<IProjectWithPackages[]>(
    () => (projectsResponse?.data ?? []) as IProjectWithPackages[],
    [projectsResponse?.data],
  );

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

  const projectOptions: SelectOption[] = useMemo(
    () =>
      projects.map((p) => ({
        label: `${p.code} — ${p.name}`,
        value: String(p.id),
      })),
    [projects],
  );

  const packageOptions: SelectOption[] = useMemo(() => {
    const filtered =
      projectId === ALL_VALUE
        ? allPackages
        : (projects.find((p) => String(p.id) === projectId)?.packages ?? []);
    return filtered.map((pkg) => ({
      label: `${pkg.code} — ${pkg.name}`,
      value: String(pkg.id),
    }));
  }, [projectId, projects, allPackages]);

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

  const { data, isLoading, isFetching } = useDocumentTracking({
    tab,
    page,
    per_page: PAGE_SIZE,
    search: apiSearch || undefined,
    projectId: projectId === ALL_VALUE ? undefined : Number(projectId),
    packageId: packageId === ALL_VALUE ? undefined : Number(packageId),
    status: status === ALL_VALUE ? undefined : (status as DocumentStatus),
    contractorId: contractorId === ALL_VALUE ? undefined : Number(contractorId),
    reviewerId: reviewerId === ALL_VALUE ? undefined : Number(reviewerId),
    submittedFrom: submittedDate
      ? format(submittedDate, "yyyy-MM-dd")
      : undefined,
    overdueOnly: overdueOnly || undefined,
  });

  const items = (data?.data ?? []).flat();
  const total = data?.pagination?.total ?? 0;

  const reviewerOptions: SelectOption[] = useMemo(() => {
    const seen = new Map<number, string>();
    items.forEach((d) => {
      (d.reviewers ?? []).forEach((r) => {
        if (r && r.id != null && !seen.has(r.id)) {
          seen.set(r.id, r.fullName);
        }
      });
    });
    return Array.from(seen, ([id, name]) => ({
      label: name,
      value: String(id),
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);
  const clearFilters = () => {
    setSearch("");
    setProjectId(ALL_VALUE);
    setPackageId(ALL_VALUE);
    setStatus(ALL_VALUE);
    setContractorId(ALL_VALUE);
    setReviewerId(ALL_VALUE);
    setSubmittedDate(undefined);
    setOverdueOnly(false);
    setPage(1);
  };

  const handleTabClick = (nextTab: DocumentTrackingTab) => {
    const slug = TAB_ROUTES[nextTab];
    setPage(1);
    navigate(slug ? `/documents-tracking/${slug}` : "/documents-tracking");
  };

  const handleView = useCallback(
    (row: IDocumentTrackingItem) =>
      navigate(`/documents-tracking/details/${row.id}`),
    [navigate],
  );

  const columns = useMemo(
    () => getDocumentTrackingColumns({ onView: handleView }),
    [handleView],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[{ label: "Administration", href: "/" }, { label: "Listing" }]}
        />
        <PageHeader
          title="Document Tracking Index"
          description="Track responsibilities, comments, responses, deadlines and decisions."
          actions={
            <Button
              onClick={() => navigate("/documents/register-submission")}
              className="h-10 w-auto cursor-pointer gap-2 bg-[#0E2E4A] px-6 text-sm hover:bg-[#0E2E4A]/90"
            >
              <FiPlus className="size-4" />
              Register submission
            </Button>
          }
        />

        {/* Tab filter */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(Object.keys(TAB_ROUTES) as DocumentTrackingTab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTabClick(t)}
                className={cn(
                  "h-9.75 cursor-pointer rounded-lg border px-3 text-sm transition",
                  active
                    ? "border-[#307DAD] bg-[#17669D] text-white"
                    : "border-[#D7E2EC] bg-white text-[#243B51] hover:bg-[#F7FAFC]",
                )}
              >
                {TAB_LABELS[t]}
              </button>
            );
          })}
        </div>

        {/* Filter card */}
        <div className="mt-4 rounded-xl border border-[#E1E9F1] bg-white p-4.5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Tracking number, document or title"
              className="w-auto! min-w-75 flex-1"
            />

            <FilterSelect
              value={projectId}
              onChange={(v) => {
                setProjectId(v);
                setPackageId(ALL_VALUE);
                setPage(1);
              }}
              options={projectOptions}
              allLabel="All projects"
              className="w-60! shrink-0"
            />

            <FilterSelect
              value={packageId}
              onChange={(v) => {
                setPackageId(v);
                setPage(1);
              }}
              options={packageOptions}
              allLabel="All packages"
              className="w-60! shrink-0"
            />

            <FilterSelect
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
              allLabel="All statuses"
              className="w-52! shrink-0"
            />

            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-10 cursor-pointer rounded-lg border border-[#D7E2EC] bg-white px-3 text-sm font-normal text-[#243B51] hover:bg-[#F7FAFC]"
            >
              Clear
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <FilterSelect
              value={contractorId}
              onChange={(v) => {
                setContractorId(v);
                setPage(1);
              }}
              options={contractorOptions}
              allLabel="All contractors"
              className="w-123.75! shrink-0"
            />

            <FilterSelect
              value={reviewerId}
              onChange={(v) => {
                setReviewerId(v);
                setPage(1);
              }}
              options={reviewerOptions}
              allLabel="All reviewers"
              className="w-60! shrink-0"
            />

            <DatePicker
              value={
                submittedDate ? format(submittedDate, "yyyy-MM-dd") : undefined
              }
              onChange={(d) => {
                setSubmittedDate(d ? new Date(`${d}T00:00:00Z`) : undefined);
                setPage(1);
              }}
              placeholder="dd/mm/yyyy"
              className="w-60! shrink-0"
            />

            <label className="ml-auto flex items-center gap-2">
              <Checkbox
                checked={overdueOnly}
                onCheckedChange={(v) => {
                  setOverdueOnly(v === true);
                  setPage(1);
                }}
                className="size-3.25 rounded-xs border-[#767676] data-checked:border-[#17669D] data-checked:bg-[#17669D] data-checked:text-white"
              />
              <span className="text-xs text-[#718499]">Overdue only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 flex min-h-0 flex-col rounded-xl border border-[#E1E9F1] bg-white p-4.5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <DataTable
          columns={columns}
          data={items}
          loading={isLoading}
          fetching={isFetching}
          rowKey={(d) => String(d.id)}
          emptyMessage={
            tab === "overdue" ||
            tab === "awaitingRecommendation" ||
            tab === "awaitingDecision"
              ? "No data yet for this tab."
              : "No documents found"
          }
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total,
            onPageChange: setPage,
            itemLabel: "Documents",
          }}
        />
      </div>
    </div>
  );
};

export default DocumentTrackingIndex;
