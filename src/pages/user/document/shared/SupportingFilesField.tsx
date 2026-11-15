import { useCallback, useState } from "react";
import { SupportingFilesDropZone } from "@/component/document/FileDropZone";
import UploadFileList from "@/component/document/UploadFileList";

export interface SupportingFileRow {
  id: string;
  file: File;
}

interface SupportingFilesFieldProps {
  id?: string;
  label?: string;
  disabled?: boolean;
  /** Called whenever the file set changes (add/remove). */
  onChange?: (files: File[]) => void;
}

const buildId = (file: File) =>
  `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;

export const SupportingFilesField = ({
  id = "supporting-files",
  label = "Upload the document",
  disabled,
  onChange,
}: SupportingFilesFieldProps) => {
  const [files, setFiles] = useState<SupportingFileRow[]>([]);

  const emit = useCallback(
    (next: SupportingFileRow[]) => {
      setFiles(next);
      onChange?.(next.map((row) => row.file));
    },
    [onChange],
  );

  const add = useCallback(
    (incoming: File[]) => {
      emit([
        ...files,
        ...incoming.map((file) => ({ id: buildId(file), file })),
      ]);
    },
    [files, emit],
  );

  const remove = useCallback(
    (rowId: string) => {
      emit(files.filter((row) => row.id !== rowId));
    },
    [files, emit],
  );

  return (
    <div>
      <SupportingFilesDropZone
        id={id}
        label={label}
        onChange={add}
        disabled={disabled}
      />
      <div className="mt-2">
        <UploadFileList files={files} onRemove={remove} />
      </div>
    </div>
  );
};
