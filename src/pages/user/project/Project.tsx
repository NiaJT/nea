import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import StatCards from "@/component/common/StatCards";
import { Button } from "@/components/ui/button";
import { getProjectColumns } from "@/component/tableColumns/projectColumns";
import SearchInput from "@/component/userPages/SearchInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import DataTable from "@/component/userPages/DataTable";
import {
  PROJECT_STATUS_OPTIONS,
  type IProject,
  type IProjectRow,
} from "@/type/project.type";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import {
  useDeleteProject,
  useProjects,
  useProjectStatistics,
  useToggleProjectStatus,
} from "@/action/useProjects";
import { useOrganizations } from "@/action/useOrganizations";
import { useDebounce } from "@/hooks/useDebounce";
import { isAxiosError } from "axios";
import { cn } from "@/lib/utils";
import NoPermission from "@/component/userPages/NoPermission";
import { ALL_VALUE, MIN_SEARCH_LENGTH, PAGE_SIZE } from "@/constants";
import type { IOrganization } from "@/type/organization.type";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";

export const ORG_PER_PAGE = 100;
const Project = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_VALUE);
  const [consultant, setConsultant] = useState(ALL_VALUE);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<IProject | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);

  const apiSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : "";

  const { can, isLoading: permLoading } = usePermissions();
  const canView = can(PERMISSIONS.PROJECT.VIEW);
  const canCreateProject = can(PERMISSIONS.PROJECT.CREATE);
  const canUpdate = can(PERMISSIONS.PROJECT.UPDATE);
  const canDelete = can(PERMISSIONS.PROJECT.DELETE);
  const canCreatePackage = can(PERMISSIONS.PACKAGE.CREATE);

  const { data, isLoading, isFetching, error } = useProjects(
    {
      page,
      perPage: PAGE_SIZE,
      search: apiSearch || undefined,
      status: status === ALL_VALUE ? undefined : status,
      consultantId: consultant === ALL_VALUE ? undefined : Number(consultant),
    },
    { enabled: canView },
  );

  const isForbidden =
    (!permLoading && !canView) ||
    (isAxiosError(error) && error.response?.status === 403);

  const { data: statsRes, isLoading: statsLoading } = useProjectStatistics({
    enabled: canView,
  });

  const deleteProject = useDeleteProject();

  const projects = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const toggleStatus = useToggleProjectStatus();

  const { data: orgsResponse } = useOrganizations({
    page: 1,
    perPage: ORG_PER_PAGE,
    organizationType: "CONSULTANT",
    status: "ACTIVE",
  });

  const consultantOptions: SelectOption[] = useMemo(
    () =>
      (orgsResponse?.data ?? []).map((org: IOrganization) => ({
        label: org.orgName,
        value: String(org.id),
      })),
    [orgsResponse],
  );

  const stats = [
    { label: "Total project", value: statsRes?.data?.totalProjects ?? 0 },
    { label: "Active package", value: statsRes?.data?.activePackages ?? 0 },
    {
      label: "Completed package",
      value: statsRes?.data?.completedPackages ?? 0,
    },
    { label: "Total Package", value: statsRes?.data?.totalPackages ?? 0 },
  ];

  const rows: IProjectRow[] = useMemo(
    () =>
      projects.flatMap((p): IProjectRow[] => {
        const packages = [...(p.packages ?? [])].sort((a, b) =>
          a.code.localeCompare(b.code, undefined, { numeric: true }),
        );

        if (packages.length === 0) {
          return [{ ...p, rowKey: `${p.id}-none`, rowPackage: null }];
        }
        return packages.map((pkg) => ({
          ...p,
          rowKey: `${p.id}-${pkg.id}`,
          rowPackage: pkg,
        }));
      }),
    [projects],
  );

  const onFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  const clearFilters = () => {
    setSearch("");
    setStatus(ALL_VALUE);
    setConsultant(ALL_VALUE);
    setPage(1);
  };

  const columns = useMemo(
    () =>
      getProjectColumns({
        onToggleActive: (p) => toggleStatus.mutate(p.id),
        onView: (p) => navigate(`/projects/${p.id}`),
        onEdit: (p) => navigate(`/projects/${p.id}/edit`),
        onDelete: setDeleteTarget,
        canView,
        canUpdate,
        canDelete,
      }),
    [navigate, toggleStatus, canView, canUpdate, canDelete],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[{ label: "Administration", href: "/" }, { label: "Project" }]}
        />
        <PageHeader
          title="Project"
          description="Maintain the package hierarchy and it's assigned delivery projects."
          actions={
            <div className="flex items-center gap-3">
              <LightButton
                className="h-10 w-auto gap-2 px-6 text-sm"
                onClick={() => navigate("/packages/add")}
                disabled={!canCreatePackage}
              >
                <FiPlus className="size-4" />
                Add Package
              </LightButton>
              <DarkButton
                icon={FiPlus}
                className="h-10 w-auto gap-2 bg-[#0E2E4A] px-6 text-sm"
                onClick={() => navigate("/projects/add")}
                disabled={!canCreateProject}
              >
                Add Project
              </DarkButton>
            </div>
          }
        />

        <div className="mt-6">
          <StatCards items={stats} loading={statsLoading} />
        </div>

        <div
          className={cn(
            "mt-6 rounded-lg border border-gray-200 bg-white px-3.5 py-5",
            isForbidden && "pointer-events-none opacity-60",
          )}
          aria-disabled={isForbidden}
          inert={isForbidden}
        >
          <div className="grid grid-cols-[1.4fr_1fr_1fr_auto] items-center gap-3">
            <SearchInput
              value={search}
              onChange={onFilterChange(setSearch)}
              placeholder="Search project name or code "
            />
            <FilterSelect
              value={status}
              onChange={onFilterChange(setStatus)}
              options={PROJECT_STATUS_OPTIONS}
              allLabel="All Status"
            />
            <FilterSelect
              value={consultant}
              onChange={onFilterChange(setConsultant)}
              options={consultantOptions}
              allLabel="All Consultants"
            />
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-auto cursor-pointer px-2 text-sm font-medium text-buttonBg hover:bg-transparent hover:text-buttonBg active:bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-col">
        {isForbidden ? (
          <NoPermission message="You don't have permission to view projects." />
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            loading={isLoading}
            fetching={isFetching}
            rowKey={(r) => r.rowKey}
            emptyMessage="No projects found"
            pagination={{
              page,
              pageSize: PAGE_SIZE,
              total,
              onPageChange: setPage,
              itemLabel: "Projects",
            }}
          />
        )}
      </div>

      <ConfirmAlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this project?"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? "this project"}? Its data will not be retrievable.`}
        confirmText="Delete"
        onConfirm={() => {
          if (!deleteTarget || !canDelete) return;
          deleteProject.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
};

export default Project;
