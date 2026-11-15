import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import FormField from "@/component/userPages/FormField";
import { type SelectOption } from "@/component/userPages/FilterSelect";
import { Textarea } from "@/components/ui/textarea";
import DarkButton from "@/component/common/DarkButton";
import LightButton from "@/component/common/LightButton";
import { successToast } from "@/component/common/Toasts";
import { DocumentSelectWithBanner } from "./DocumentSelectWithBanner";
import { LuSave } from "react-icons/lu";
import type { IDocumentTrackingItem } from "@/type/document.type";
import { SupportingFilesField } from "@/pages/user/document/shared/SupportingFilesField";
import { useRegisterSubmission } from "@/action/useDocuments";

const REVISION_OPTIONS: SelectOption[] = [
  { label: "00", value: "00" },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
];

interface SubmissionFormCardProps {
  documents: IDocumentTrackingItem[];
  initialDocumentId?: string;
}

const getDocumentId = (doc: IDocumentTrackingItem): string => {
  const id =
    (doc as IDocumentTrackingItem & { documentId?: string | number })
      .documentId ?? doc.id;
  return id != null ? String(id) : "";
};

export const SubmissionFormCard = ({
  documents,
  initialDocumentId,
}: SubmissionFormCardProps) => {
  const navigate = useNavigate();

  const isLocked = !!initialDocumentId;

  const [documentId, setDocumentId] = useState(initialDocumentId ?? "");
  const [revision, setRevision] = useState("00");
  const [remarks, setRemarks] = useState("");
  const [supportingEvidence, setSupportingEvidence] = useState<File[]>([]);

  const { mutate: registerSubmission, isPending } = useRegisterSubmission();

  const effectiveDocumentId =
    initialDocumentId ||
    documentId ||
    (documents.length === 1 ? getDocumentId(documents[0]) : "");

  const now = useMemo(() => new Date(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveDocumentId) {
      // Guard against submitting without a document selected
      return;
    }

    registerSubmission(
      {
        documentId: effectiveDocumentId,
        remarks,
        evidenceFiles: supportingEvidence,
      },
      {
        onSuccess: () => {
          successToast(
            "Submission registered",
            "The document has been logged.",
          );
          navigate("/documents-tracking");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E1E9F1] bg-white p-4.5 shadow-[0px_2px_9px_rgba(21,58,97,0.03)]"
    >
      <div className="flex flex-col gap-4">
        <DocumentSelectWithBanner
          documentId={effectiveDocumentId}
          onDocumentChange={setDocumentId}
          revision={revision}
          onRevisionChange={setRevision}
          documents={documents}
          revisionOptions={REVISION_OPTIONS}
          isLocked={isLocked}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Submission date *">
            <input
              type="text"
              value={now.toLocaleDateString("en-GB")}
              disabled
              className="h-10 w-full rounded-lg border border-[#D7E2EC] bg-[#F7FAFC] px-3 text-sm text-[#243B51]"
            />
          </FormField>
          <FormField label="Received date *">
            <input
              type="text"
              value={now.toLocaleDateString("en-GB")}
              disabled
              className="h-10 w-full rounded-lg border border-[#D7E2EC] bg-[#F7FAFC] px-3 text-sm text-[#243B51]"
            />
          </FormField>
        </div>

        <FormField label="Remarks">
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="min-h-20 w-full rounded-lg border-[#D7E2EC] bg-white"
            placeholder="Enter any remarks..."
            disabled={isPending}
          />
        </FormField>

        <FormField label="Supporting evidence">
          <div className="max-w-md">
            <SupportingFilesField
              id="supporting-evidence"
              label="Upload supporting evidence"
              onChange={setSupportingEvidence}
              disabled={isPending}
            />
          </div>
        </FormField>
      </div>

      <div className="mt-6 flex justify-end gap-4 border-t border-[#E8EEF4] pt-4.5">
        <LightButton
          type="button"
          onClick={() => navigate(-1)}
          className="w-56.5 gap-2"
          disabled={isPending}
        >
          Cancel
        </LightButton>

        <DarkButton
          type="submit"
          icon={LuSave}
          loading={isPending}
          loadingText="Registering..."
          className="w-56.5 gap-2 bg-buttonBg hover:bg-buttonBg/90"
          disabled={isPending || !effectiveDocumentId}
        >
          Register submission
        </DarkButton>
      </div>
    </form>
  );
};
