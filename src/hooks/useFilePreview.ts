import requests from "@/helper/requests";
import { errorToast } from "@/component/common/Toasts";

interface PreviewParams {
  documentId: number;
  fileId: number;
  source?: string;
}

export const useFilePreview = () => {
  const previewFile = async ({ documentId, fileId, source }: PreviewParams) => {
    try {
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
      window.open(url, "_blank");
      // revoke later if you keep the tab open briefly
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error(err);
      errorToast("Preview failed", "Could not preview the file.");
    }
  };

  return { previewFile };
};
