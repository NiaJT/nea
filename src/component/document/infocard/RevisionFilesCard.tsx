import LightButton from "@/component/common/LightButton";

export interface RevisionFile {
  revision: string;
  label: string;
  isCurrent?: boolean;
  onPreview?: () => void;
  onDownload?: () => void;
}

interface RevisionFilesCardProps {
  files: RevisionFile[];
  /** Labels for the row buttons. */
  previewLabel?: string;
  downloadLabel?: string;
}

export const RevisionFilesCard = ({
  files,
  previewLabel = "Preview",
  downloadLabel = "Download",
}: RevisionFilesCardProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Revision files
      </h2>

      <div className="flex flex-col gap-2.5">
        {files.length === 0 && (
          <p className="text-[13px] text-[#73869A]">No revision files yet.</p>
        )}

        {files.map((file) => (
          <div
            key={file.revision}
            className="flex items-center justify-between rounded-lg border border-[#E1E9EF] p-3"
          >
            <div className="flex flex-col">
              <span className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
                Rev {file.revision}
              </span>
              <span className="text-[13px] leading-[16px] text-[#73869A]">
                {file.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LightButton
                onClick={file.onPreview}
                className="h-[39px] w-[84px] px-3 text-[16px] leading-[19px] text-[#243B51]"
              >
                {previewLabel}
              </LightButton>
              <LightButton
                onClick={file.onDownload}
                className="h-[39px] w-[99px] px-3 text-[16px] leading-[19px] text-[#243B51]"
              >
                {downloadLabel}
              </LightButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
