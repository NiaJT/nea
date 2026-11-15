import { useMemo } from "react";
import DataTable, { type Column } from "@/component/userPages/DataTable";

export interface AttachmentFile {
  id: string;
  fileId: number;
  fileName: string;
  revision: string;
  isAttachment: boolean;
  source?: string;
}

interface AttachmentsTabProps {
  files: AttachmentFile[];
  onPreview?: (file: AttachmentFile) => void;
  onDownload?: (file: AttachmentFile) => void;
  onUpload?: (files: File[]) => void;
}

export const AttachmentsTab = ({
  files,
  onPreview,
  onDownload,
}: AttachmentsTabProps) => {
  const columns = useMemo<Column<AttachmentFile>[]>(
    () => [
      {
        key: "fileName",
        header: "File",
        headerClassName: "pl-6",
        className: "pl-6",
        cell: (row) => (
          <span className="text-[12px] text-[#17283C]">{row.fileName}</span>
        ),
      },
      {
        key: "revision",
        header: "Revision",
        headerClassName: "w-[120px]",
        cell: (row) => (
          <span className="text-[12px] text-[#17283C]">Rev {row.revision}</span>
        ),
      },
      {
        key: "source",
        header: "Source",
        headerClassName: "w-[160px]",
        cell: (row) => (
          <span className="text-[12px] text-[#17283C]">
            {row.source ?? "—"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Action",
        headerClassName: "w-[200px]",
        cell: (row) => (
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#126BA3]">
            {onPreview && (
              <>
                <button
                  type="button"
                  onClick={() => onPreview(row)}
                  className="hover:underline"
                >
                  Preview
                </button>
                <span className="font-normal text-[#17283C]">·</span>
              </>
            )}
            {onDownload && (
              <button
                type="button"
                onClick={() => onDownload(row)}
                className="hover:underline"
              >
                Download
              </button>
            )}
          </div>
        ),
      },
    ],
    [onPreview, onDownload],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
        <div className="p-5 pb-0">
          <h2 className="mb-4 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
            Files across revisions
          </h2>
        </div>
        <div className="[&_.rounded-lg]:border-0 [&_.rounded-lg]:shadow-none [&_thead]:bg-[#F7FAFC] [&_th]:h-[41px] [&_th]:text-[12px] [&_th]:text-[#6E8295] [&_td]:py-[13px] [&_tr]:h-auto [&_tr]:border-[#E9EFF4] p-2">
          <DataTable
            columns={columns}
            data={files}
            rowKey={(row) => row.id}
            emptyMessage="No files found"
          />
        </div>
      </div>
    </div>
  );
};
