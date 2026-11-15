import {
  useCreatePackageType,
  usePackageType,
  useUpdatePackageType,
} from "@/action/usePackageType";
import DarkButton from "@/component/common/DarkButton";
import FormInput from "@/component/common/FormInput";
import LightButton from "@/component/common/LightButton";
import FilterSelect from "@/component/userPages/FilterSelect";
import FormField from "@/component/userPages/FormField";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import { EMPTY_PACKAGE_TYPE_VALUES } from "@/tempData/PackageTypeData";

import {
  PACKAGE_TYPE_OPTIONS,
  type IPackageTypeCreatePayload,
} from "@/type/packageType.type";
import {
  packageTypeSchema,
  type PackageTypeFormValues,
} from "@/validation/packageType.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";

const AddEditPackageType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const title = isEdit ? "Edit Package Type" : "Add Package Type";

  const { data: packageTypeRes, isLoading } = usePackageType(
    isEdit ? Number(id) : undefined,
  );
  const packageType = packageTypeRes?.data;
  const notFound = isEdit && !isLoading && !packageType;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PackageTypeFormValues>({
    resolver: zodResolver(packageTypeSchema),
    defaultValues: EMPTY_PACKAGE_TYPE_VALUES,
  });

  const createPackageType = useCreatePackageType();
  const updatePackageType = useUpdatePackageType();

  const onSubmit = async (values: PackageTypeFormValues) => {
    const payload: IPackageTypeCreatePayload = {
      name: values.name,
      status: values.status,
    };

    try {
      if (isEdit) {
        await updatePackageType.mutateAsync({ id: Number(id), data: payload });
      } else {
        await createPackageType.mutateAsync(payload);
      }
      navigate("/package-type");
    } catch (error) {
      console.log({ error });
      // const message = getApiErrorMessage(error);
      // if (message?.toLowerCase().includes("code")) {
      //   setError("code", { message });
      // }
    }
  };

  useEffect(() => {
    if (!packageType) return;
    reset({
      name: packageType.name,
      status: packageType.status,
    });
  }, [packageType, reset]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Package Type", href: "/package-type" },
            { label: title },
          ]}
        />
        <PageHeader
          title={title}
          description={
            isEdit
              ? "Update the package type details."
              : "Create new package type details."
          }
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {notFound ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">
              This Package Type could not be found.
            </p>
            <LightButton
              className="w-40"
              onClick={() => navigate("/package-type")}
            >
              Back to Package Type
            </LightButton>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Package Type details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fields marked * are required. IDs should be assigned by the
              system.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <FormField
                label="Package type name *"
                error={errors.name?.message}
              >
                <FormInput
                  {...register("name")}
                  placeholder="Package Type Name"
                />
              </FormField>

              <FormField label="Status *" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={PACKAGE_TYPE_OPTIONS}
                      placeholder="Select status"
                      className="h-11!"
                    />
                  )}
                />
              </FormField>
            </div>

            <div className="mt-6 rounded-md bg-[#F0F7FC] px-5 py-3.5 text-sm text-[#41677E]">
              Validation: project code must be unique; planned completion cannot
              precede the start date; actual completion is recorded when
              applicable.
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <LightButton
                className="w-60"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </LightButton>
              <DarkButton
                icon={FiSave}
                className="w-60 gap-2"
                loading={isSubmitting}
                loadingText="Saving..."
                onClick={handleSubmit(onSubmit)}
              >
                Save Package Type
              </DarkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditPackageType;
