import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import LightButton from "@/component/common/LightButton";
import { useDocument } from "@/action/useDocuments";
import { useMe } from "@/action/useAuth";
import requests from "@/helper/requests";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useFilePreview } from "@/hooks/useFilePreview";
import type { AttachmentFile } from "@/component/document/revision/AttachmentTab";
import { format } from "date-fns";

interface CommentsAndResponsesTabProps {
  documentId: number;
  revisionId: number;
}

export const CommentsAndResponsesTab = ({
  documentId,
  revisionId,
}: CommentsAndResponsesTabProps) => {
  const navigate = useNavigate();

  const { data: user } = useMe();
  const orgType = String(user?.organization?.type ?? "").toUpperCase();
  const isContractor = orgType === "CONTRACTOR";

  const { downloadFile } = useFileDownload();
  const { previewFile } = useFilePreview();

  const { data: docResponse } = useDocument(documentId);
  const doc = docResponse?.data;

  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["document-reviews", revisionId],
    queryFn: async () => {
      const res = await requests.document.getReviews(revisionId);
      return res.data;
    },
    enabled: !!revisionId,
  });

  const reviews = reviewsResponse?.data ?? [];

  const revisionNumber = String(doc?.revision?.revisionNumber ?? 0).padStart(
    2,
    "0",
  );

  // Recommendation / decision blocks attached to the document
  const recommendation = doc?.recommendation ?? null;
  const decision = doc?.decision ?? null;

  const handlePreviewAttachment = (file: AttachmentFile) => {
    if (!doc) return;
    previewFile({
      documentId: doc.documentId,
      fileId: file.fileId,
      source: file.source,
    });
  };

  const handleDownloadAttachment = (file: AttachmentFile) => {
    if (!doc) return;
    downloadFile({
      documentId: doc.documentId,
      fileId: file.fileId,
      source: file.source,
      fallbackFilename: file.fileName,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#E1E9F1] bg-white">
        <p className="text-sm text-gray-500">Loading comments…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E1E9F1] bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <div className="p-[18px]">
          <h3 className="text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
            Comments & responses · Rev {revisionNumber}
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-[46px] pt-[62px]">
            <p className="text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6F8294]">
              No issued comments in this round.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-[18px] pb-[18px]">
            {reviews.map((review) => {
              const comments = review.comments ?? [];
              const allAnswered =
                comments.length > 0 &&
                comments.every((c) => !!c.contractorResponse);

              return (
                <div
                  key={review.id}
                  className="flex flex-col gap-3 rounded-[10px] border border-[#DCE8F0] p-[15px]"
                >
                  {/* Round header */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#718499]">
                    <span>Round {review.roundNumber ?? 1}</span>
                    <span>·</span>
                    <span>By {review.reviewerName ?? "--"}</span>
                    <span>·</span>
                    <span>{review.reviewDate ?? "—"}</span>
                  </div>

                  {/* Comments */}
                  {comments.map((comment, idx) => {
                    const response = comment.contractorResponse ?? null;

                    return (
                      <div
                        key={comment.id}
                        className="flex flex-col gap-2 rounded-lg border border-[#EEF2F6] bg-[#FBFCFE] p-3"
                      >
                        <h4 className="text-[15px] font-bold leading-[18px] tracking-[-0.3125px] text-[#17283C]">
                          C-
                          {String(comment.sequenceNumber ?? idx + 1).padStart(
                            2,
                            "0",
                          )}{" "}
                          · {comment.finding}
                        </h4>
                        <p className="text-[13px] leading-[21px] text-[#718499]">
                          {comment.observation}
                        </p>

                        {/* Contractor response (singular) */}
                        {response ? (
                          <div className="rounded-md border border-[#CBE3F2] bg-[#F2F8FC] p-2.5">
                            <div className="flex items-center justify-between text-[11px] text-[#6A8296]">
                              <span className="font-bold text-[#126BA3]">
                                Contractor response
                              </span>
                              <span>
                                {response.respondedAt
                                  ? format(
                                      new Date(response.respondedAt),
                                      "dd/MM/yyyy HH:mm",
                                    )
                                  : ""}
                              </span>
                            </div>
                            <p className="mt-1 text-[13px] leading-[21px] text-[#17283C]">
                              {response.responseText}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[12px] italic text-[#9CA3AF]">
                            Awaiting contractor response.
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Review supporting files */}
                  {(review.files ?? []).length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-[#17283C]">
                        Review attachments
                      </span>
                      {review.files.map((file) => {
                        const attachment: AttachmentFile = {
                          id: `${file.source ?? "REVIEW"}-${file.id}`,
                          fileId: file.id,
                          fileName: file.originalFilename,
                          revision: revisionNumber,
                          isAttachment: true,
                          source: file.source,
                        };

                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-md border border-[#DCE6EF] px-3 py-2"
                          >
                            <span className="truncate text-xs text-[#243B51]">
                              {attachment.fileName}
                            </span>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#126BA3]">
                              <button
                                type="button"
                                onClick={() =>
                                  handlePreviewAttachment(attachment)
                                }
                                className="hover:underline"
                              >
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownloadAttachment(attachment)
                                }
                                className="hover:underline"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Respond button — hidden once every comment has a response */}
                  {isContractor && !allAnswered && (
                    <div className="mt-2 flex justify-end">
                      <LightButton
                        onClick={() =>
                          navigate(
                            `/documents/contractor-response?documentId=${documentId}&revisionId=${revisionId}&reviewId=${review.id}&roundNumber=${review.roundNumber ?? 1}`,
                          )
                        }
                        className="h-[39px] w-auto px-4 text-[16px] leading-[19px] text-[#243B51]"
                      >
                        Respond ({comments.length} comments)
                      </LightButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Recommendation block ─── */}
        {recommendation && (
          <div className="px-[18px] pb-[18px]">
            <div className="rounded-[10px] border border-[#CBE3F2] bg-[#F2F8FC] p-[15px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#126BA3]">
                  Recommendation · Round {recommendation.roundNumber ?? 1}
                </span>
                <span className="text-[11px] text-[#6A8296]">
                  By {recommendation.recommendedBy?.fullName ?? "—"}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-bold text-[#17283C]">
                {String(recommendation.outcome ?? "—").replaceAll("_", " ")}
              </p>
              {recommendation.rationale && (
                <p className="mt-1 text-[13px] leading-[21px] text-[#718499]">
                  {recommendation.rationale}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── Decision block ─── */}
        {decision && (
          <div className="px-[18px] pb-[18px]">
            <div className="rounded-[10px] border border-[#D5EAD9] bg-[#F1F9F2] p-[15px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#126BA3]">
                  Decision
                </span>
                <span className="text-[11px] text-[#6A8296]">
                  By {decision.decidedBy?.fullName ?? "NEA"}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-bold text-[#17283C]">
                {String(decision.outcome ?? "—").replaceAll("_", " ")}
              </p>
              {decision.rationale && (
                <p className="mt-1 text-[13px] leading-[21px] text-[#718499]">
                  {decision.rationale}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
