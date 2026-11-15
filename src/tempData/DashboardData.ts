import type { StatCardProps } from "@/pages/user/dashboard/StatCard";

export const SAFEGUARD_STATS: StatCardProps[] = [
  { label: "EMP activities", value: 142, href: "/safeguards" },
  { label: "Compliant", value: 113, href: "/safeguards?status=compliant" },
  {
    label: "Non-compliant",
    value: 12,
    href: "/safeguards?status=non-compliant",
    tone: "danger",
  },
  {
    label: "Pending",
    value: 17,
    href: "/safeguards?status=pending",
    tone: "warning",
  },
  { label: "Corrective actions", value: 26, href: "/corrective-actions" },
  { label: "Open grievances", value: 8, href: "/grievances?status=open" },
];

export const QUALITY_STATS: StatCardProps[] = [
  { label: "Pour cards", value: 186, href: "/pour-cards" },
  { label: "Cube tests", value: 168, href: "/cube-tests" },
  { label: "Passed tests", value: 141, href: "/cube-tests?status=passed" },
  {
    label: "Failed tests",
    value: 7,
    href: "/cube-tests?status=failed",
    tone: "danger",
  },
  {
    label: "Pending tests",
    value: 20,
    href: "/cube-tests?status=pending",
    tone: "warning",
  },
];

export const INVOICE_STATS: StatCardProps[] = [
  {
    label: "Consultant invoices",
    value: 38,
    href: "/invoices?type=consultant",
  },
  {
    label: "Contractor invoices",
    value: 74,
    href: "/invoices?type=contractor",
  },
  {
    label: "Pending invoices",
    value: 12,
    href: "/invoices?status=pending",
    tone: "warning",
  },
  { label: "Approved invoices", value: 21, href: "/invoices?status=approved" },
  { label: "Paid invoices", value: 79, href: "/invoices?status=paid" },
];

export const GUARANTEE_STATS: StatCardProps[] = [
  {
    label: "Active APBG/PBG",
    value: 16,
    href: "/bank-guarantees?status=active",
  },
  {
    label: "Expiring soon",
    value: 3,
    href: "/bank-guarantees?status=expiring",
    tone: "warning",
  },
  {
    label: "Expired",
    value: 1,
    href: "/bank-guarantees?status=expired",
    tone: "danger",
  },
  { label: "Released", value: 7, href: "/bank-guarantees?status=released" },
];

export const ACTION_STATS: StatCardProps[] = [
  { label: "Open actions", value: 48, href: "/actions?status=open" },
  {
    label: "Overdue actions",
    value: 11,
    href: "/actions?status=overdue",
    tone: "danger",
  },
  { label: "Completed actions", value: 219, href: "/actions?status=completed" },
];
