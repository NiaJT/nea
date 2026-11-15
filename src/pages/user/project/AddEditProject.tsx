import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FiSave } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import DatePicker from "@/component/common/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_PROJECT_VALUES } from "../../../tempData/ProjectData";
import FormField from "@/component/userPages/FormField";
import FormInput from "../../../component/common/FormInput";
import FilterSelect, {
  type SelectOption,
} from "@/component/userPages/FilterSelect";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import {
  projectSchema,
  type ProjectFormValues,
} from "@/validation/project.schema";
import { format } from "date-fns";
import { useRegions } from "@/action/useRegions";
import { useOrganizations } from "@/action/useOrganizations";
import type { IOrganization } from "@/type/organization.type";
import {
  getApiErrorMessage,
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/action/useProjects";
import {
  PROJECT_STATUS_OPTIONS,
  type IProjectCreatePayload,
} from "@/type/project.type";
import { usePermissions } from "@/utils/usePermissions";
import { PERMISSIONS } from "@/utils/permissions";
import NoPermission from "@/component/userPages/NoPermission";

const ORG_PER_PAGE = 100;

const AddEditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const title = isEdit ? "Edit Project" : "Add Project";

  const { can, isLoading: permLoading } = usePermissions();
  const canSave = isEdit
    ? can(PERMISSIONS.PROJECT.UPDATE)
    : can(PERMISSIONS.PROJECT.CREATE);
  const canViewProject = can(PERMISSIONS.PROJECT.VIEW);

  const { data: regionRes, isLoading: regionsLoading } = useRegions();
  const { data: orgsResponse } = useOrganizations({
    page: 1,
    perPage: ORG_PER_PAGE,
    organizationType: "CONSULTANT",
    status: "ACTIVE",
  });

  const { data: projectRes, isLoading: projectLoading } = useProject(
    isEdit ? Number(id) : undefined,
    { enabled: canViewProject },
  );

  const project = projectRes?.data;
  const notFound = isEdit && !projectLoading && !project;

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const regionOptions = useMemo(
    () =>
      (regionRes?.data ?? []).map((r) => ({
        label: r.name,
        value: String(r.id),
      })),
    [regionRes],
  );

  const organizationOptions: SelectOption[] = useMemo(() => {
    const options = (orgsResponse?.data ?? []).map((org: IOrganization) => ({
      label: org.orgName,
      value: String(org.id),
    }));

    const current = project?.consultant;
    if (current && !options.some((o) => o.value === String(current.id))) {
      options.unshift({ label: current.orgName, value: String(current.id) });
    }
    return options;
  }, [orgsResponse, project]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: EMPTY_PROJECT_VALUES,
  });

  const startDate = watch("startDate");

  useEffect(() => {
    if (!project) return;
    reset({
      name: project.name,
      code: project.code,
      consultant: project.consultant ? String(project.consultant.id) : "",
      startDate: project.startDate ?? "",
      plannedCompletion: project.approxCompletionDate ?? "",
      actualCompletion: project.completionDate ?? "",
      regionId: project.region ? String(project.region.id) : "",
      status: project.status,
      description: project.description ?? "",
      remarks: project.remarks ?? "",
    });
  }, [project, reset]);

  const onSubmit = async (values: ProjectFormValues) => {
    if (!canSave) return;
    const payload: IProjectCreatePayload = {
      name: values.name,
      code: values.code,
      status: values.status,
      regionId: Number(values.regionId),
      consultantId: Number(values.consultant),
      startDate: values.startDate || null,
      approxCompletionDate: values.plannedCompletion || null,
      completionDate: values.actualCompletion || null,
      description: values.description || null,
      remarks: values.remarks || null,
    };

    try {
      if (isEdit) {
        await updateProject.mutateAsync({ id: Number(id), data: payload });
      } else {
        await createProject.mutateAsync(payload);
      }
      navigate("/projects");
    } catch (error) {
      const message = getApiErrorMessage(error);
      if (message?.toLowerCase().includes("code")) {
        setError("code", { message });
      }
    }
  };

  if (!permLoading && !canSave) {
    return (
      <NoPermission
        message={`You don't have permission to ${isEdit ? "edit" : "add"} projects.`}
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
              ? "Update the project details."
              : "Register a package before adding projects."
          }
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {notFound ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">This project could not be found.</p>
            <LightButton className="w-40" onClick={() => navigate("/projects")}>
              Back to Projects
            </LightButton>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Project details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fields marked * are required. IDs should be assigned by the
              system.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              <FormField label="Project name *" error={errors.name?.message}>
                <FormInput {...register("name")} placeholder="Project Name" />
              </FormField>

              <FormField label="Project code *" error={errors.code?.message}>
                <FormInput {...register("code")} placeholder="Project Code" />
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
                      options={organizationOptions}
                      placeholder={"Select consultant"}
                      className="h-11!"
                      emptyMessage="No consultant available yet"
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
                error={errors.plannedCompletion?.message}
              >
                <Controller
                  name="plannedCompletion"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={isEdit}
                      disabled={(date) =>
                        isEdit ||
                        (!!startDate && format(date, "yyyy-MM-dd") < startDate)
                      }
                    />
                  )}
                />
              </FormField>

              {/* <FormField
                label="Actual completion date"
                error={errors.actualCompletion?.message}
              >
                <Controller
                  name="actualCompletion"
                  control={control}
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>  */}

              <FormField label="Region *" error={errors.regionId?.message}>
                <Controller
                  name="regionId"
                  control={control}
                  render={({ field }) => (
                    <FilterSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={regionOptions}
                      placeholder={
                        regionsLoading ? "Loading regions..." : "Select region"
                      }
                      className="h-11!"
                      emptyMessage="No regions available yet"
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
                      options={PROJECT_STATUS_OPTIONS}
                      placeholder="Select status"
                      className="h-11!"
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
                    placeholder="Project Description"
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
                disabled={!canSave}
                title={canSave ? undefined : "You don't have permission"}
                loading={isSubmitting}
                loadingText="Saving..."
                onClick={handleSubmit(onSubmit)}
              >
                Save Project
              </DarkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditProject;
