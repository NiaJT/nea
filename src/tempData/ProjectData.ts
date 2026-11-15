import type { IPackage, IProject } from "@/type/project.type";
import type { ProjectFormValues } from "@/validation/project.schema";

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
];

export const CONSULTANT_OPTIONS = [
  "WAI Nepal Pvt. Ltd.",
  "Himal Design Consultants",
  "Valley Technical Services",
  "Eastern Engineering JV",
].map((c) => ({ value: c, label: c }));

export const PROJECT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
];

export const MOCK_PROJECTS: IProject[] = [
  {
    id: 1,
    code: "PIC-ETDSP: C1",
    name: "Koshi Corridor Transmission Project",
    projectId: "PRJ-001",
    client: "Nepal Electricity Authority",
    consultant: {
      id: 2,
      orgName: "WAI Nepal Pvt. Ltd.",
      orgType: "CONSULTANT",
      orgCode: "WAINP",
      contactPerson: "",
      contact: "",
      contactEmail: "",
      address: "",
      status: "ACTIVE",
    },
    region: { id: 1, name: "Koshi Province" },
    startDate: "2024-04-15",
    approxCompletionDate: "2027-06-30",
    completionDate: null,
    plannedCompletion: "2027-06-30",
    projectCount: 4,
    status: "ACTIVE",
    description:
      "Transmission and substation works across the eastern corridor.",
    remarks: "Package monitoring in progress.",
    userIds: [],
  },
  {
    id: 2,
    code: "PIC-ETDSP: C2",
    name: "Upper Tamakoshi Substation Upgrade",
    projectId: "PRJ-002",
    client: "Nepal Electricity Authority",
    consultant: {
      id: 3,
      orgName: "Himal Design Consultants",
      orgType: "CONSULTANT",
      orgCode: "HDC",
      contactPerson: "",
      contact: "",
      contactEmail: "",
      address: "",
      status: "ACTIVE",
    },
    region: { id: 3, name: "Bagmati Province" },
    startDate: "2025-01-10",
    approxCompletionDate: "2027-12-31",
    completionDate: null,
    plannedCompletion: "2027-12-31",
    projectCount: 3,
    status: "ACTIVE",
    description: null,
    remarks: null,
    userIds: [],
  },
];

export const EMPTY_PROJECT_VALUES: ProjectFormValues = {
  name: "",
  code: "",
  consultant: "",
  startDate: "",
  plannedCompletion: "",
  actualCompletion: "",
  regionId: "",
  status: "" as ProjectFormValues["status"],
  description: "",
  remarks: "",
};

export const MOCK_PACKAGES: IPackage[] = [
  {
    id: 1,
    projectId: "PRJ-001",
    number: "P1",
    name: "Transmission Line Works — East",
    type: "Transmission line",
    contractor: "Himal Infrastructure Pvt. Ltd.",
    consultant: "WAI Nepal Pvt. Ltd.",
    region: "Koshi Province",
    startDate: "2024-05-01",
    completion: "2027-03-31",
    status: "ACTIVE",
    description: "Transmission Line Works — East",
    remarks: "Civil works and tower erection.",
  },
  {
    id: 2,
    projectId: "PRJ-001",
    number: "P2",
    name: "Substation Civil & Electrical Works",
    type: "Substation",
    contractor: "Everest Power Construction",
    consultant: "",
    region: "Koshi Province",
    startDate: "",
    completion: "2027-06-30",
    status: "ACTIVE",
  },
  {
    id: 3,
    projectId: "PRJ-001",
    number: "P3",
    name: "Access Road & Site Preparation",
    type: "Civil works",
    contractor: "Koshi Builders JV",
    consultant: "",
    region: "Koshi Province",
    startDate: "",
    completion: "2026-12-31",
    status: "ACTIVE",
  },
];

export const PACKAGE_TYPE_OPTIONS = [
  "Transmission line",
  "Substation",
  "Civil works",
].map((v) => ({ value: v, label: v }));

export const CONTRACTOR_OPTIONS = [
  "Himal Infrastructure Pvt. Ltd.",
  "Everest Power Construction",
  "Koshi Builders JV",
  "Contractor 1",
  "Contractor 2",
].map((v) => ({ value: v, label: v }));

export const REGION_OPTIONS = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
].map((v) => ({ value: v, label: v }));
