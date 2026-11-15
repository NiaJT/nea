import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { InfoBlock } from "./InfoBlock";

export interface DocumentRecord {
  epicId: string;
  documentId: string;
  number: string;
  title: string;
  type: string;
  project: string;
  package: string;
  contractor: string;
  currentRevision: string;
  documentState: string;
  approvedRevision: string | null;
  approvedBy?: string | null;
}

export interface CardAction {
  label: string;
  onClick: () => void;
  variant?: "light" | "dark";
  disabled?: boolean;
}

interface DocumentRecordCardProps {
  record: DocumentRecord;
  /** Buttons rendered in the footer. */
  actions?: CardAction[];
}

export const DocumentRecordCard = ({
  record,
  actions = [],
}: DocumentRecordCardProps) => {
  return (
    <div className="rounded-xl border border-[#E1E9F1] bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-[14px] font-bold leading-[17px] tracking-[-0.150391px] text-[#17283C]">
        Document record · {record.epicId}
      </h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <InfoBlock label="Document ID" value={record.documentId} />
        <InfoBlock label="Number" value={record.number} />
        <InfoBlock label="Title" value={record.title} />
        <InfoBlock label="Type" value={record.type} />
        <InfoBlock label="Project" value={record.project} />
        <InfoBlock label="Package" value={record.package} />
        <InfoBlock label="Contractor" value={record.contractor} />
        <InfoBlock
          label="Current file revision"
          value={record.currentRevision}
        />
        <InfoBlock label="Document state" value={record.documentState} />
        <InfoBlock
          label="Approved revision"
          value={record.approvedRevision ?? "—"}
        />
        <InfoBlock label="Approved by" value={record.approvedBy ?? "—"} />
      </div>

      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4">
          {actions.map((action) => {
            const isDark = action.variant === "dark";

            if (isDark) {
              return (
                <DarkButton
                  key={action.label}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="h-[39px] w-auto "
                >
                  {action.label}
                </DarkButton>
              );
            }

            return (
              <LightButton
                key={action.label}
                onClick={action.onClick}
                disabled={action.disabled}
                className="h-[39px] w-auto "
              >
                {action.label}
              </LightButton>
            );
          })}
        </div>
      )}
    </div>
  );
};
