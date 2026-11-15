import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave } from "react-icons/fi";
import FormDialog from "@/component/common/FormDialog";
import FormInput from "@/component/common/FormInput";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import FormField from "@/component/userPages/FormField";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import type { IRole } from "@/type/role.type";
import { roleSchema, type RoleFormValues } from "@/validation/role.schema";

const defaultValues: RoleFormValues = {
  name: "",
  description: "",
  organizationId: "",
};

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: IRole | null;
  /** Preselected org when the dialog is opened from a specific group */
  organizationId?: number | null;
  /** Organization options derived from the API (id → name) */
  organizationOptions: SelectOption[];
  onSubmit: (values: RoleFormValues) => void | Promise<void>;
}

const RoleFormDialog = ({
  open,
  onOpenChange,
  role,
  organizationId,
  organizationOptions,
  onSubmit,
}: RoleFormDialogProps) => {
  const [saving, setSaving] = useState(false);
  const isEdit = !!role;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      role
        ? {
            name: role.name,
            description: role.description,
            organizationId:
              role.organizationId?.toString() ??
              organizationId?.toString() ??
              "",
          }
        : {
            ...defaultValues,
            organizationId: organizationId?.toString() ?? "",
          },
    );
  }, [open, role, organizationId, reset]);

  const submit = async (values: RoleFormValues) => {
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="Role details">
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
          <FormField label="Role name" error={errors.name?.message}>
            <FormInput
              placeholder="e.g. NEA Project Manager"
              disabled={saving}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Organization"
            error={errors.organizationId?.message}
          >
            <Controller
              name="organizationId"
              control={control}
              render={({ field }) => (
                <FilterSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={organizationOptions}
                  placeholder="Select organization"
                  className="h-11!"
                  disabled={isEdit || saving}
                  emptyMessage="No organizations available yet"
                />
              )}
            />
          </FormField>

          <FormField
            label="Description"
            error={errors.description?.message}
            className="md:col-span-2"
          >
            <FormInput
              placeholder="Full System configuration, user & role administration access all modules."
              disabled={saving}
              {...register("description")}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-4">
          <LightButton
            type="button"
            className="w-44"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            icon={FiSave}
            className="w-44 gap-2"
            loading={saving}
            loadingText="Saving..."
            disabled={saving}
          >
            Save Role
          </DarkButton>
        </div>
      </form>
    </FormDialog>
  );
};

export default RoleFormDialog;
