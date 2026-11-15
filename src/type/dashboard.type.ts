export interface IDashboardProjectsPackages {
  totalProjects: number;
  totalPackages: number;
  activePackages: number;
  completedPackages: number;
}

export interface IDashboardDocuments {
  totalDocuments: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  pending: number;
  overdue: number;
}
