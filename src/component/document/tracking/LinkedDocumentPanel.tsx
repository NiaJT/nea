import { Button } from "@/components/ui/button";

interface LinkedDocumentPanelProps {
  documentNumber: string;
  revision: string;
  onPreview?: () => void;
}

export const LinkedDocumentPanel = ({
  documentNumber,
  revision,
  onPreview,
}: LinkedDocumentPanelProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-[18px] shadow-[0px_2px_9px_rgba(21,58,97,0.03)]">
      <h3 className="text-sm font-bold leading-[17px] tracking-[-0.1504px] text-[#17283C]">
        Linked EPIC-05 document
      </h3>
      <p className="mt-4 text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
        {documentNumber} · Rev {revision}
      </p>

      <div className="mt-4 flex h-[180px] w-full items-center justify-center rounded-[10px] border border-dashed border-[#C4D6E4] bg-[#F2F6F9]">
        <p className="text-center text-[16px] leading-[19px] tracking-[-0.3125px] text-[#6B7F91]">
          Document preview placeholder
          <br />
          <span className="text-[14px]">No sample source file attached</span>
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onPreview}
        className="mt-4 h-[39px] w-full rounded-lg border-[#D7E2EC] bg-white text-base font-normal text-[#243B51] hover:bg-[#F7FAFC]"
      >
        Preview / download revision
      </Button>
    </div>
  );
};
