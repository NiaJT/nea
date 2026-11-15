import { useState } from "react";
import { useNavigate } from "react-router";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { useMe } from "@/action/useAuth";
import type { DocumentStatus } from "@/type/document.type";
import { CancelSubmissionDialog } from "../form/CancelSubmissionDialog";

interface DocumentActionButtonsProps {
  documentId: number;
  revisionId?: number;
  recommendationId?: number;
  status?: DocumentStatus;
  documentTrackingId?: string;
  revisionNumber?: number;
  onEditMetadata: () => void;
  onDownload?: () => void;
  orgType?: string;
  isDownloading?: boolean;
}

export const DocumentActionButtons = ({
  documentId,
  revisionId,
  recommendationId,
  status,
  documentTrackingId = "",
  revisionNumber = 0,
  onEditMetadata,
  onDownload,
  isDownloading,
}: DocumentActionButtonsProps) => {
  const navigate = useNavigate();
  const { data: userResponse, isLoading: isUserLoading } = useMe();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const isUserPending = isUserLoading || !userResponse;

  if (isUserPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-[39px] w-32 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-[39px] w-40 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  const orgType = String(userResponse?.organization?.type ?? "").toUpperCase();
  const isContractor = orgType === "CONTRACTOR";
  const isConsultant = orgType === "CONSULTANT";
  const isNea = orgType === "NEA";

  const canReview = isConsultant || isNea;
  const canDecide = isNea;

  const buttons = [];

  const awaitingDecision =
    status === "RECOMMENDED" ||
    status === "RECOMMENDED_APPROVAL" ||
    status === "RECOMMENDED_REJECTION" ||
    status === "RECOMMENDED_RESUBMISSION";

  // 1. Contractor
  if (isContractor) {
    if (status === "DRAFT") {
      buttons.push(
        <LightButton
          key="edit"
          onClick={onEditMetadata}
          className="h-9.75 w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
        >
          Edit metadata
        </LightButton>,
      );
    }

    if (status === "RESUBMISSION_REQUIRED") {
      buttons.push(
        <LightButton
          key="upload-rev"
          onClick={() => navigate(`/documents/${documentId}/revise`)}
          className="h-[39px] w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
        >
          New revision
        </LightButton>,
        <LightButton
          key="cancel-submission"
          onClick={() => setIsCancelModalOpen(true)}
          className="h-[39px] w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
        >
          Cancel submission
        </LightButton>,
      );
    }
  }

  // 2. Reviewer
  if (canReview && status === "UNDER_REVIEW" && revisionId) {
    buttons.push(
      <DarkButton
        key="review"
        onClick={() =>
          navigate(
            `/documents/review?revisionId=${revisionId}&documentId=${documentId}`,
          )
        }
        className="h-[39px] w-auto bg-[#17669D] px-4 text-[16px] leading-[19px] hover:bg-[#17669D]/90"
      >
        Review
      </DarkButton>,
    );
  }

  // 3. Decision (NEA only)
  if (canDecide && awaitingDecision && recommendationId) {
    buttons.push(
      <DarkButton
        key="decision"
        onClick={() =>
          navigate(
            `/documents/decision?recommendationId=${recommendationId}&documentId=${documentId}`,
          )
        }
        className="h-[39px] w-auto bg-[#17669D] px-4 text-[16px] leading-[19px] hover:bg-[#17669D]/90"
      >
        Decision
      </DarkButton>,
    );
  }

  // 4. Universal
  buttons.push(
    <LightButton
      key="view"
      onClick={() => navigate(`/documents/${documentId}`)}
      className="h-[39px] w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
    >
      View Document
    </LightButton>,
  );

  if (onDownload) {
    buttons.push(
      <LightButton
        key="download"
        onClick={onDownload}
        disabled={isDownloading}
        className="h-[39px] w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
      >
        {isDownloading ? "Downloading..." : "Download current"}
      </LightButton>,
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">{buttons}</div>

      <CancelSubmissionDialog
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        documentId={documentId}
        documentTrackingId={documentTrackingId}
        revisionNumber={revisionNumber}
      />
    </>
  );
};
