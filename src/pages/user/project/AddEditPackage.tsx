import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { FiSave } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import DatePicker from "@/component/common/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import {
  EMPTY_PACKAGE_VALUES,
  packageSchema,
  type PackageFormValues,
  type PackageSubmitValues,
} from "../../../validation/project.schema";
import FormField from "@/component/userPages/FormField";
import FormInput from "../../../component/common/FormInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import { getApiErrorMessage, useProjects } from "@/action/useProjects";
import { useRegions } from "@/action/useRegions";
import { useOrganizations } from "@/action/useOrganizations";
import type { IOrganization } from "@/type/organization.type";
import {
  PACKAGE_STATUS_OPTIONS,
  type IPackageCreatePayload,
} from "@/type/project.type";
import { usePackageTypes } from "@/action/usePackageType";
import {
  useCreatePackage,
  usePackage,
  useUpdatePackage,
} from "@/action/usePackages";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import NoPermission from "@/component/userPages/NoPermission";

const ORG_PER_PAGE = 100;
const PROJECT_PER_PAGE = 100;

const AddEditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const title = isEdit ? "Edit Package" : "Add Package";
  const presetProjectId = searchParams.get("projectId") ?? "";
  const { can, isLoading: permLoading } = usePermissions();
  const canSave = isEdit
    ? can(PERMISSIONS.PACKAGE.UPDATE)
    : can(PERMISSIONS.PACKAGE.CREATE);
  const canViewPackage = can(PERMISSIONS.PACKAGE.VIEW);

  const { data: projectsRes } = useProjects({
    page: 1,
    perPage: PROJECT_PER_PAGE,
  });

  const { data: pkgRes, isLoading: packageLoading } = usePackage(
    isEdit ? Number(id) : undefined,
    { enabled: canViewPackage },
  );
  const pkg = pkgRes?.data;
  const notFound = isEdit && !packageLoading && !pkg;

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();

  const { data: regionRes } = useRegions();
  const { data: orgsResponse } = useOrganizations({
    page: 1,
    perPage: ORG_PER_PAGE,
  });
  const { data: packageTypeRes, isLoading: packageTypesLoading } =
    usePackageTypes();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormValues, unknown, PackageSubmitValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: { ...EMPTY_PACKAGE_VALUES, parentProject: presetProjectId },
  });

  const startDate = watch("startDate");
  const parentProject = watch("parentProject");

  const projectOptions: SelectOption[] = useMemo(() => {
    const options = (projectsRes?.data ?? []).map((p) => ({
      label: p.name,
      value: String(p.id),
    }));
    const parent = pkg?.project;
    if (parent && !options.some((o) => o.value === String(parent.id))) {
      options.unshift({ label: parent.name, value: String(parent.id) });
    }
    return options;
  }, [projectsRes, pkg]);

  const selectedProject = useMemo(() => {
    const fromList = (projectsRes?.data ?? []).find(
      (p) => String(p.id) === parentProject,
    );
    if (fromList) return fromList;
    return pkg?.project && String(pkg.project.id) === parentProject
      ? pkg.project
      : null;
  }, [projectsRes, parentProject, pkg]);

  const selectedConsultant = selectedProject?.consultant ?? null;
  const selectedRegion = selectedProject?.region ?? null;

  useEffect(() => {
    setValue(
      "consultant",
      selectedConsultant ? String(selectedConsultant.id) : "",
      {
        shouldValidate: Boolean(selectedConsultant),
      },
    );
  }, [selectedConsultant, setValue]);

  useEffect(() => {
    setValue("region", selectedRegion ? String(selectedRegion.id) : "", {
      shouldValidate: Boolean(selectedRegion),
    });
  }, [selectedRegion, setValue]);

  const consultantOptions: SelectOption[] = useMemo(() => {
    const options = (orgsResponse?.data ?? [])
      .filter((o: IOrganization) => o.orgType === "CONSULTANT")
      .map((o: IOrganization) => ({ label: o.orgName, value: String(o.id) }));

    if (
      selectedConsultant &&
      !options.some((o) => o.value === String(selectedConsultant.id))
    ) {
      options.unshift({
        label: selectedConsultant.orgName,
        value: String(selectedConsultant.id),
      });
    }
    return options;
  }, [orgsResponse, selectedConsultant]);

  const contractorOptions: SelectOption[] = useMemo(
    () =>
      (orgsResponse?.data ?? [])
        .filter((o: IOrganization) => o.orgType === "CONTRACTOR")
        .map((o: IOrganization) => ({ label: o.orgName, value: String(o.id) })),
    [orgsResponse],
  );

  const packageTypeOptions: SelectOption[] = useMemo(
    () =>
      (packageTypeRes?.data ?? []).map((t) => ({
        label: t.name,
        value: String(t.id),
      })),
    [packageTypeRes],
  );

  const regionOptions: SelectOption[] = useMemo(() => {
    const options = (regionRes?.data ?? []).map((r) => ({
      label: r.name,
      value: String(r.id),
    }));

    if (
      selectedRegion &&
      !options.some((o) => o.value === String(selectedRegion.id))
    ) {
      options.unshift({
        label: selectedRegion.name,
        value: String(selectedRegion.id),
      });
    }
    return options;
  }, [regionRes, selectedRegion]);

  useEffect(() => {
    if (!pkg) return;
    reset({
      parentProject: pkg.project ? String(pkg.project.id) : "",
      number: pkg.code,
      name: pkg.name,
      type: pkg.packageType ? String(pkg.packageType.id) : "",
      contractor: String(pkg.contractor?.id),
      consultant: pkg.project?.consultant
        ? String(pkg.project.consultant.id)
        : "",
      region: pkg.project?.region ? String(pkg.project.region.id) : "",
      status: pkg.status,
      startDate: pkg.startDate ?? "",
      completionDate: pkg.approxCompletionDate ?? "",
      description: pkg.description ?? "",
      remarks: pkg.remarks ?? "",
    });
  }, [pkg, reset]);

  const onSubmit = async (values: PackageSubmitValues) => {
    if (!canSave) return;
    const payload: IPackageCreatePayload = {
      name: values.name,
      code: values.number,
      status: values.status,
      startDate: values.startDate || null,
      approxCompletionDate: values.completionDate || null,
      description: values.description || null,
      remarks: values.remarks || null,
      projectId: Number(values.parentProject),
      packageTypeId: Number(values.type),
      contractorId: values.contractor,
      consultantId: Number(values.consultant),
      regionId: Number(values.region),
    };

    try {
      if (isEdit) {
        await updatePackage.mutateAsync({ id: Number(id), data: payload });
      } else {
        await createPackage.mutateAsync(payload);
      }
      navigate(`/projects/${payload.projectId}`);
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (message?.toLowerCase().includes("code")) {
        setError("number", { message });
      }
    }
  };

  if (!permLoading && !canSave) {
    return (
      <NoPermission
        message={`You don't have permission to ${isEdit ? "edit" : "add"} packages.`}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: title },
          ]}
        />
        <PageHeader
          title={title}
          description={
            isEdit
              ? "Update the package details."
              : "Assign a project to one parent project."
          }
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {notFound ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">This package could not be found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Package details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A package belongs to exactly one project. IDs should be assigned
              by the system.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <FormField
                label="Parent Project *"
                error={errors.parentProject?.message}
              >
                <Controller
                  name="parentProject"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={projectOptions}
                      placeholder="Select project"
                      className="h-11!"
                      emptyMessage="No projects available yet"
                      disabled={isEdit}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Package number *"
                error={errors.number?.message}
              >
                <FormInput placeholder="e.g. P1" {...register("number")} />
              </FormField>

              <FormField label="Package name *" error={errors.name?.message}>
                <FormInput {...register("name")} placeholder="Package Name" />
              </FormField>

              <FormField label="Package type *" error={errors.type?.message}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={packageTypeOptions}
                      placeholder={
                        packageTypesLoading ? "Loading types..." : "Select type"
                      }
                      className="h-11!"
                      emptyMessage="No package type available yet"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Contractor *"
                error={errors.contractor?.message}
              >
                <Controller
                  name="contractor"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value != null ? String(field.value) : ""}
                      onChange={field.onChange}
                      options={contractorOptions}
                      placeholder="Select Contractor"
                      className="h-11!"
                      emptyMessage="No contractor available yet"
                    />
                    // <MultiSelect
                    //   value={field.value}
                    //   onChange={field.onChange}
                    //   options={contractorOptions}
                    //   placeholder="Select contractors"
                    // />
                  )}
                />
              </FormField>

              <FormField
                label="Consultant *"
                error={errors.consultant?.message}
              >
                <Controller
                  name="consultant"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={consultantOptions}
                      placeholder={
                        parentProject
                          ? "Select consultant"
                          : "Select project first"
                      }
                      className="h-11!"
                      emptyMessage="No consultant available yet"
                      disabled
                    />
                  )}
                />
              </FormField>

              <FormField label="Region *" error={errors.region?.message}>
                <Controller
                  name="region"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={regionOptions}
                      placeholder={
                        parentProject ? "Select region" : "Select project first"
                      }
                      className="h-11!"
                      emptyMessage="No regions available yet"
                      disabled
                    />
                  )}
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
                      options={PACKAGE_STATUS_OPTIONS}
                      placeholder="Select status"
                      className="h-11!"
                    />
                  )}
                />
              </FormField>

              <FormField label="Start date *" error={errors.startDate?.message}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={isEdit}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Tentative date *"
                error={errors.completionDate?.message}
              >
                <Controller
                  name="completionDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={isEdit}
                      disabled={(date) =>
                        !!startDate && format(date, "yyyy-MM-dd") < startDate
                      }
                    />
                  )}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  error={errors.description?.message}
                >
                  <Textarea
                    rows={4}
                    className="rounded-lg border-gray-200 bg-white"
                    {...register("description")}
                    placeholder="Package Description"
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Remarks" error={errors.remarks?.message}>
                  <Textarea
                    rows={4}
                    className="rounded-lg border-gray-200 bg-white"
                    {...register("remarks")}
                    placeholder="Remarks"
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-[#F0F7FC] px-5 py-3.5 text-sm text-[#41677E]">
              Validation: package number should be unique within the selected
              project; completion cannot precede the start date. Contractor
              access is limited to its assigned package.
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <LightButton className="w-60" onClick={() => navigate(-1)}>
                Cancel
              </LightButton>
              <DarkButton
                icon={FiSave}
                className="w-60 gap-2"
                loading={isSubmitting}
                loadingText="Saving..."
                disabled={!canSave}
                title={canSave ? undefined : "You don't have permission"}
                onClick={handleSubmit(onSubmit)}
              >
                Save Package
              </DarkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditPackage;
