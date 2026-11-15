import { useSearchParams } from "react-router";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { SubmissionFormCard } from "@/component/document/form/SubmissionFormCard";
import { useDocuments } from "@/action/useDocuments";
import type { IDocumentTrackingItem } from "@/type/document.type";

const getDocId = (doc: IDocumentTrackingItem): string => {
  const id =
    (doc as IDocumentTrackingItem & { documentId?: string | number | null })
      .documentId ?? doc.id;
  return id != null ? String(id) : "";
};

const RegisterSubmission = () => {
  const [searchParams] = useSearchParams();

  const paramDocumentId = searchParams.get("documentId")?.trim() || "";

  const { data: response, isLoading } = useDocuments({
    page: 1,
    per_page: 100,
    status: "DRAFT",
  });

  const allDocuments = (response?.data ??
    []) as unknown as IDocumentTrackingItem[];

  const eligibleDocuments = allDocuments.filter(
    (doc) => !doc.documentTrackingId,
  );

  const documentsToDisplay = paramDocumentId
    ? eligibleDocuments.filter((doc) => getDocId(doc) === paramDocumentId)
    : eligibleDocuments;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading documents…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Documents", href: "/documents-tracking" },
            { label: "Listing" },
          ]}
        />
        <PageHeader
          title="Register submission"
          description="Track responsibilities, comments, responses, deadlines and decisions."
        />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <SubmissionFormCard
          documents={documentsToDisplay}
          initialDocumentId={paramDocumentId || undefined}
        />
      </div>
    </div>
  );
};

export default RegisterSubmission;
