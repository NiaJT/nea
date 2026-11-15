import LightButton from "@/component/common/LightButton";

export interface WorkflowStep {
  label: string;
  isCurrent?: boolean;
  apiStatus?: string;
}

export interface OverviewSidebarProps {
  currentRevision: string;
  submissionDate?: string;
  onPreviewFile?: () => void;
  approvedRevisionText?: string;
  workflowSteps: WorkflowStep[];
}

export const OverviewSidebar = ({
  currentRevision,
  submissionDate,
  onPreviewFile,
  approvedRevisionText = "No approval recorded.",
  workflowSteps,
}: OverviewSidebarProps) => {
  return (
    <div className="flex w-full flex-col gap-4 overflow-auto">
      {/* Current File Card */}
      <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
          Current file
        </h2>
        <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#C4D6E4] bg-[#F2F6F9]">
          <span className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
            Rev {currentRevision}
          </span>
          <span className="mt-2 text-[12px] leading-[14px] text-[#718499]">
            {submissionDate
              ? `Submitted on ${submissionDate}`
              : "No date recorded"}
          </span>
          <LightButton
            onClick={onPreviewFile}
            disabled={!onPreviewFile}
            className="mt-4 h-[39px] w-auto px-3 text-[16px] leading-[19px] text-[#243B51]"
          >
            Preview file
          </LightButton>
        </div>
      </div>

      {/* Approved Revision Card */}
      <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
          Approved revision
        </h2>
        <p className="text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
          {approvedRevisionText}
        </p>
        <div className="mt-4 border-l-[3px] border-[#4592BE] bg-[#F0F7FC] p-3">
          <p className="text-[12px] leading-[14px] text-[#41677E]">
            Status and approval metadata are read-only here and supplied by the
            authorized tracking workflow.
          </p>
        </div>
      </div>

      {/* Status & Workflow Card */}
      <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
          Status & workflow
        </h2>
        <div className="flex flex-col gap-2.5">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-[#DCE6EF] px-4 py-[14px]"
            >
              <span className="text-[13px] font-bold leading-[16px] tracking-[-0.0761719px] text-[#17283C]">
                {step.label}
              </span>
              {step.isCurrent && (
                <span className="rounded-full bg-[#E9F2FA] px-3 py-1 text-[11px] tracking-[0.0644531px] text-[#246492]">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-[#F0F7FC] p-3 text-[12px] leading-[14px] text-[#41677E]">
          Next actions follow configured workflow and user permissions.
        </div>
      </div>
    </div>
  );
};
