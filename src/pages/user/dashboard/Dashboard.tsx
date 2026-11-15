import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import PriorityWorkQueue from "./Priorityworkqueue";
import ActionProgress from "./Actionprogress";
// import {
//   ACTION_STATS,
//   GUARANTEE_STATS,
//   INVOICE_STATS,
//   QUALITY_STATS,
//   SAFEGUARD_STATS,
// } from "@/tempData/DashboardData";
import StatSection from "./StatSection";
import {
  useDashboardDocuments,
  useDashboardProjectsPackages,
} from "@/action/useDashboard";
import type { StatCardProps } from "./StatCard";

const Dashboard = () => {
  const { data: ppRes, isLoading: ppLoading } = useDashboardProjectsPackages();
  const { data: docRes, isLoading: docLoading } = useDashboardDocuments();

  const pp = ppRes?.data;
  const doc = docRes?.data;

  const projectStats: StatCardProps[] = [
    {
      label: "Total projects",
      value: pp?.totalProjects ?? 0,
      href: "/projects",
    },
    {
      label: "Total packages",
      value: pp?.totalPackages ?? 0,
      href: "/projects",
    },
    {
      label: "Active packages",
      value: pp?.activePackages ?? 0,
      href: "/projects",
    },
    {
      label: "Completed packages",
      value: pp?.completedPackages ?? 0,
      href: "/projects",
    },
  ];

  const documentStats: StatCardProps[] = [
    {
      label: "Total documents",
      value: doc?.totalDocuments ?? 0,
      href: "/documents",
    },
    {
      label: "Submitted",
      value: doc?.submitted ?? 0,
      href: "/documents?status=SUBMITTED",
    },
    {
      label: "Under review",
      value: doc?.underReview ?? 0,
      href: "/documents?status=UNDER_REVIEW",
    },
    {
      label: "Approved",
      value: doc?.approved ?? 0,
      href: "/documents?status=APPROVED",
    },
    {
      label: "Rejected",
      value: doc?.rejected ?? 0,
      href: "/documents?status=REJECTED",
      tone: "danger",
    },
    {
      label: "Pending",
      value: doc?.pending ?? 0,
      href: "/documents?status=PENDING",
      tone: "warning",
    },
    {
      label: "Overdue",
      value: doc?.overdue ?? 0,
      href: "/documents?status=OVERDUE",
      tone: "danger",
    },
  ];

  // const withHref = (stats: StatCardProps[], href: string) =>
  //   stats.map((s) => ({ ...s, href: s.href ?? href }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb items={[{ label: "Dashboard", href: "/" }]} />
        <PageHeader
          title="Dashboard"
          description="Monitor project health and act on work that needs attentions"
        />
      </div>

      <div className="-mx-1 mt-8 min-h-0 flex-1 space-y-6 overflow-y-auto px-1 pb-6">
        <StatSection
          title="Projects & packages"
          stats={projectStats}
          loading={ppLoading}
        />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PriorityWorkQueue />
          <ActionProgress />
        </section>

        <StatSection
          title="Documents"
          stats={documentStats}
          loading={docLoading}
        />
        {/* <StatSection
          title="Safeguards & corrective actions"
          stats={withHref(SAFEGUARD_STATS, "/safeguards")}
        />
        <StatSection
          title="Construction quality"
          stats={withHref(QUALITY_STATS, "/qa")}
        />
        <StatSection
          title="Invoices"
          stats={withHref(INVOICE_STATS, "/contracts")}
        />
        <StatSection
          title="Bank guarantees"
          stats={withHref(GUARANTEE_STATS, "/contracts")}
        />
        <StatSection
          title="Assigned actions"
          stats={withHref(ACTION_STATS, "/meeting")}
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;
