import { FiX } from "react-icons/fi";

interface UploadFileListProps {
  files: { id: string; file: File }[];
  onRemove: (id: string) => void;
}

const UploadFileList = ({ files, onRemove }: UploadFileListProps) => {
  if (files.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {files.map((row) => (
        <li
          key={row.id}
          className="flex items-center justify-between rounded-lg border border-[#E1E9F1] bg-[#F7FAFC] px-3 py-2 text-xs text-[#243B51]"
        >
          <span className="truncate">{row.file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            className="cursor-pointer rounded p-1 text-[#718499] hover:bg-white hover:text-[#243B51]"
            aria-label={`Remove ${row.file.name}`}
          >
            <FiX className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UploadFileList;
