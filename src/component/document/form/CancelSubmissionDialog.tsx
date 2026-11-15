import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormDialog from "@/component/common/FormDialog";
import FormField from "@/component/userPages/FormField";
import { Textarea } from "@/components/ui/textarea";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { useCancelDocument } from "@/action/useDocuments";

const cancelSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required"),
});

type CancelFormValues = z.infer<typeof cancelSchema>;

interface CancelSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: number;
  documentTrackingId: string;
  revisionNumber: number;
}

export const CancelSubmissionDialog = ({
  open,
  onOpenChange,
  documentId,
  documentTrackingId,
  revisionNumber,
}: CancelSubmissionDialogProps) => {
  const { mutate: cancelDocument, isPending } = useCancelDocument();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = (values: CancelFormValues) => {
    cancelDocument(
      {
        documentId,
        reason: values.reason.trim(),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      },
    );
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel Submission"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col rounded-[10px] border border-[#DCE8F0] p-[15px]">
          <h3 className="text-[16px] font-bold leading-[19px] tracking-[-0.3125px] text-[#17283C]">
            Cancel tracking system
          </h3>
          <p className="mt-1 text-[13px] leading-[21px] tracking-[-0.0761719px] text-[#718499]">
            {documentTrackingId || "Draft Document"} · Rev{" "}
            {String(revisionNumber).padStart(2, "0")}
          </p>

          <div className="mt-4">
            <FormField
              label="Cancellation reason *"
              error={errors.reason?.message}
            >
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Provide a reason for cancelling..."
                    className="min-h-[80px] rounded-lg border-[#D7E2EC] bg-white"
                    disabled={isPending}
                  />
                )}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-[22px] flex justify-end gap-2 border-t border-[#E8EEF4] pt-[18px]">
          <LightButton
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-[39px] w-[149px]"
            disabled={isPending}
          >
            Keep submission
          </LightButton>
          <DarkButton
            type="submit"
            className="h-[39px] w-[188px]"
            loading={isPending}
            loadingText="Cancelling..."
            disabled={isPending}
          >
            Confirm cancellation
          </DarkButton>
        </div>
      </form>
    </FormDialog>
  );
};
