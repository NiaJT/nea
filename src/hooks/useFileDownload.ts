import { useState } from "react";
import requests from "@/helper/requests";
import { errorToast } from "@/component/common/Toasts";

interface DownloadParams {
  documentId: number;
  fileId?: number;
  source?: string;
  fallbackFilename: string;
}

export const useFileDownload = () => {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const downloadFile = async ({
    documentId,
    fileId,
    source,
    fallbackFilename,
  }: DownloadParams) => {
    try {
      setDownloadingId(documentId);

      const res = await requests.document.getDocumentFile(
        documentId,
        fileId,
        source ? { source } : undefined,
      );

      const blob = new Blob([res.data], {
        type:
          typeof res.headers["content-type"] === "string"
            ? res.headers["content-type"]
            : "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);

      const disposition = res.headers["content-disposition"] as
        | string
        | undefined;
      const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      const filename = match?.[1]
        ? decodeURIComponent(match[1])
        : fallbackFilename;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      errorToast("Download failed", "Could not download the file.");
    } finally {
      setDownloadingId(null);
    }
  };

  return { downloadFile, downloadingId };
};
