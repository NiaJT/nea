import { useMemo } from "react";
import FormField from "@/component/userPages/FormField";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import type { IDocumentTrackingItem } from "@/type/document.type";
import FormInput from "@/component/common/FormInput";

interface DocumentSelectWithBannerProps {
  documentId: string;
  onDocumentChange: (id: string) => void;
  revision: string | number;
  onRevisionChange: (val: string) => void;
  documents: IDocumentTrackingItem[];
  revisionOptions: SelectOption[];
  isLocked?: boolean;
}

type DocumentWithOptionalId = IDocumentTrackingItem & {
  documentId?: string | number | null;
};

const getDocumentId = (document: IDocumentTrackingItem): string => {
  const documentWithOptionalId = document as DocumentWithOptionalId;
  return String(documentWithOptionalId.documentId ?? document.id);
};

export const DocumentSelectWithBanner = ({
  documentId,
  onDocumentChange,
  revision,
  documents,
  isLocked = false,
}: DocumentSelectWithBannerProps) => {
  const documentOptions: SelectOption[] = useMemo(
    () =>
      documents.map((doc) => ({
        label: ` ${doc.title} · ${doc.packageName}`,
        value: getDocumentId(doc),
      })),
    [documents],
  );

  const selectedDoc = useMemo(
    () => documents.find((d) => getDocumentId(d) === documentId),
    [documents, documentId],
  );
  console.log("selectedDoc", selectedDoc, documentId, documents);

  const displayRevision = useMemo(
    () => String(revision).padStart(2, "0"),
    [revision],
  );

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Existing document *">
        <FilterSelect
          value={documentId}
          onChange={onDocumentChange}
          options={documentOptions}
          allLabel="Select an existing document"
          className="h-10! w-full"
          disabled={isLocked}
        />
      </FormField>

      {selectedDoc && (
        <div className="rounded-lg bg-[#EDF5FB] px-3 py-3">
          <p className="text-xs text-[#506D84]">
            Project: {selectedDoc.projectName || "—"} · Package:{" "}
            {selectedDoc.packageName || "—"} · Contractor:{" "}
            {selectedDoc.contractorName || "—"}
          </p>
        </div>
      )}

      <FormField label="Document revision *">
        <FormInput
          value={displayRevision}
          className="w-full rounded-lg border-[#D7E2EC] bg-white"
          disabled
        />
      </FormField>
    </div>
  );
};
