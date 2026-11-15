import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave } from "react-icons/fi";
import FormDialog from "@/component/common/FormDialog";
import FormInput from "@/component/common/FormInput";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import {
  organizationSchema,
  type OrganizationFormValues,
} from "@/validation/organization.schema";
import FormField from "@/component/userPages/FormField";
import FilterSelect from "@/component/userPages/FilterSelect";
import type { IOrganization } from "@/type/organization.type";
import { ORGNIZATION_OPTIONS } from "@/component/tableColumns/organizationColumns";

const defaultValues: OrganizationFormValues = {
  name: "",
  type: "",
  code: "",
  email: "",
  phone: "",
};

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: IOrganization | null;
  onSubmit: (values: OrganizationFormValues) => void | Promise<void>;
}

const OrganizationFormDialog = ({
  open,
  onOpenChange,
  organization,
  onSubmit,
}: OrganizationFormDialogProps) => {
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(organization);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      organization
        ? {
            name: organization.orgName,
            type: organization.orgType,
            code: organization.orgCode,
            email: organization.contactEmail,
            phone: organization.contact,
          }
        : defaultValues,
    );
  }, [open, organization, reset]);

  const submit = async (values: OrganizationFormValues) => {
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit organization" : "Add organization"}
    >
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
          <FormField label="Organization name" error={errors.name?.message}>
            <FormInput placeholder="e.g. Rajesh Singh" {...register("name")} />
          </FormField>

          <FormField label="Organization Type" error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FilterSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={ORGNIZATION_OPTIONS}
                  placeholder="Select type"
                  className="h-11!"
                />
              )}
            />
          </FormField>

          <FormField label="Organization Code" error={errors.code?.message}>
            <FormInput placeholder="e.g. NEA" {...register("code")} />
          </FormField>

          <FormField label="Contact Email" error={errors.email?.message}>
            <FormInput
              type="email"
              placeholder="name@organization.com"
              {...register("email")}
            />
          </FormField>

          <FormField label="Contact Phone Number" error={errors.phone?.message}>
            <FormInput
              type="tel"
              placeholder="+97798601231234"
              {...register("phone")}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-4">
          <LightButton
            type="button"
            className="w-44"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </LightButton>
          <DarkButton
            type="submit"
            icon={FiSave}
            className="w-48 gap-2"
            loading={saving}
            loadingText="Saving..."
          >
            {isEditing ? "Update Organization" : "Save Organization"}
          </DarkButton>
        </div>
      </form>
    </FormDialog>
  );
};

export default OrganizationFormDialog;
