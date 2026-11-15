import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { FiArrowRight } from "react-icons/fi";

import requests from "@/helper/requests";
import type { IDocumentReviewHistoryItem } from "@/type/document.type";

interface ReviewRoundsTabProps {
  onViewComments: (reviewId: number) => void;
}

export const ReviewRoundsTab = ({ onViewComments }: ReviewRoundsTabProps) => {
  const { id } = useParams<{ id: string }>();
  const documentId = id ? Number(id) : undefined;

  const {
    data: historyResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["review-history", documentId],
    queryFn: async () => {
      const res = await requests.document.getReviewHistory(documentId!);
      return res.data;
    },
    enabled: !!documentId,
  });

  const rounds: IDocumentReviewHistoryItem[] = historyResponse?.data ?? [];

  console.log("[ReviewRoundsTab] state", {
    documentId,
    isLoading,
    isError,
    error,
    rounds: rounds.length,
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <p className="text-sm text-gray-500">Loading review rounds…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <p className="text-sm text-red-500">
          Failed to load review rounds:{" "}
          {(error as Error)?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <p className="text-sm text-gray-500">No review rounds found yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Review rounds
      </h3>

      <div className="flex flex-col gap-3">
        {rounds.map((round) => {
          const { review } = round;
          const revLabel = String(round.revisionNumber).padStart(2, "0");
          const isInitial =
            review.roundNumber === 1 && round.revisionNumber === 0;

          const rec = review.recommendation;
          let recText = "Recommendation pending";
          if (rec) {
            recText = `Recommendation: ${String(rec.outcome).replaceAll(
              "_",
              " ",
            )}`;
          }

          let decText = "Decision: pending";
          if (rec) {
            if (rec.revisionStatus === "APPROVED")
              decText = "Decision: Approved";
            else if (rec.revisionStatus === "REJECTED")
              decText = "Decision: Rejected";
            else if (rec.revisionStatus === "RESUBMISSION_REQUIRED")
              decText = "Decision: Resubmission Required";
            else if (rec.revisionStatus === "CANCELLED")
              decText = "Decision: Cancelled";
            else decText = "Decision: issued";
          }

          return (
            <div
              key={`${round.revisionId}-${review.id}`}
              className="flex flex-col rounded-r-md border-l-[3px] border-[#2C84B4] bg-[#F2F8FC] p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
                  Round {review.roundNumber} · Rev {revLabel}{" "}
                  {isInitial ? "· Initial" : ""}
                </span>

                <button
                  type="button"
                  onClick={() => onViewComments(review.id)}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-[#126BA3] hover:underline"
                >
                  View comments & responses
                  <FiArrowRight className="size-3" />
                </button>
              </div>

              <div className="mt-2 text-[11px] tracking-[0.0644531px] text-[#6A8296]">
                Review Date {review.reviewDate ?? "—"}
              </div>

              <div className="mt-1 text-[16px] tracking-[-0.3125px] text-[#6B7F91]">
                {recText} · {decText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
