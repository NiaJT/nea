import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FiSave } from "react-icons/fi";
import PageBreadcrumb from "@/component/userPages/PageBreadcrumb";
import PageHeader from "@/component/userPages/PageHeader";
import FormSection from "@/component/userPages/FormSection";
import FormField from "@/component/userPages/FormField";
import FilterSelect from "@/component/userPages/FilterSelect";
import LightButton from "@/component/common/LightButton";
import DarkButton from "@/component/common/DarkButton";
import FormInput from "@/component/common/FormInput";
import { userSchema, type UserFormValues } from "@/validation/user.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmAlertDialog from "@/component/dialog/ConfirmAlertDialog";
import { LuLoaderCircle } from "react-icons/lu";
import { cn } from "@/lib/utils";
import UserSidePanel from "@/component/userPages/UserSidePanel";
import type { IUser, UserStatus } from "@/type/user.type";
import {
  useCreateUser,
  useToggleUserStatus,
  useUpdateUser,
  useUser,
} from "@/action/useUsers";
import { useOrganizations } from "@/action/useOrganizations";
import { useRoles } from "@/action/useRoles";
import { useProjects } from "@/action/useProjects";
import MultiSelect from "@/component/common/MultiSelect";

const ACCOUNT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const STATUS_TO_FORM: Record<UserStatus, string> = {
  SUSPENDED: "suspended",
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const STATUS_TO_API: Record<string, UserStatus> = {
  suspended: "SUSPENDED",
  active: "ACTIVE",
  inactive: "INACTIVE",
};

const defaultValues: UserFormValues = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  organization: "",
  accountStatus: "",
  primaryRole: "",
  additionalRoles: "",
  project: "",
  packageIds: [],
};

const toFormValues = (u: IUser): UserFormValues => ({
  fullName: u.fullName,
  username: u.username ?? "",
  email: u.email,
  phone: u.phoneNumber ?? "",
  organization: u.organizationId ? String(u.organizationId) : "",
  accountStatus: STATUS_TO_FORM[u.userStatus] ?? "",
  primaryRole: String(u.roleId),
  additionalRoles: "",
  project: u.assignedProjects?.[0] ? String(u.assignedProjects[0].id) : "",
  packageIds: (u.assignedPackages ?? []).map((p) => String(p.id)),
});

const AddEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const userId = isEdit ? Number(id) : undefined;

  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const { data: userRes, isLoading, isError } = useUser(userId);
  const user = userRes?.data;
  const { data: roleRes } = useRoles({ page: 1, perPage: 100 });

  const { data: projectsRes } = useProjects({ page: 1, perPage: 100 });
  const projects = projectsRes?.data ?? [];

  const { data: orgRes } = useOrganizations({
    page: 1,
    perPage: 100,
    status: "ACTIVE",
  });
  const orgOptions = useMemo(
    () =>
      (orgRes?.data ?? []).map((o) => ({
        value: String(o.id),
        label: o.orgName,
      })),
    [orgRes],
  );

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const toggleStatus = useToggleUserStatus();
  const saving = createUser.isPending || updateUser.isPending;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) reset(toFormValues(user));
  }, [user?.id, reset]);

  const isActive = user?.userStatus === "ACTIVE";
  const organization = watch("organization");

  const roleOptions = useMemo(() => {
    const options = (roleRes?.data ?? [])
      .filter((r) => String(r.organizationId) === organization)
      .map((r) => ({
        value: String(r.id),
        label: r.name,
      }));

    if (
      user &&
      organization === String(user.organizationId) &&
      !options.some((o) => o.value === String(user.roleId))
    ) {
      options.unshift({ value: String(user.roleId), label: user.roleName });
    }

    return options;
  }, [roleRes, organization, user]);

  const selectedProject = watch("project");

  const projectOptions = useMemo(() => {
    const options = projects.map((p) => ({
      label: p.name,
      value: String(p.id),
    }));
    for (const ap of user?.assignedProjects ?? []) {
      if (!options.some((o) => o.value === String(ap.id))) {
        options.unshift({ label: ap.name, value: String(ap.id) });
      }
    }
    return options;
  }, [projects, user]);

  const packageOptions = useMemo(() => {
    const options = (
      projects.find((p) => String(p.id) === selectedProject)?.packages ?? []
    ).map((pkg) => ({
      label: `${pkg.code} — ${pkg.name}`,
      value: String(pkg.id),
    }));
    for (const ap of user?.assignedPackages ?? []) {
      if (!options.some((o) => o.value === String(ap.id))) {
        options.push({ label: ap.name, value: String(ap.id) });
      }
    }
    return options;
  }, [projects, selectedProject, user]);

  const onSubmit = async (values: UserFormValues) => {
    const data = {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      phoneNumber: values.phone,
      organizationId: Number(values.organization),
      roleId: Number(values.primaryRole),
      status: STATUS_TO_API[values.accountStatus],
    };

    const payload = { ...data, packageIds: values.packageIds.map(Number) };

    try {
      if (isEdit && userId !== undefined) {
        await updateUser.mutateAsync({ id: userId, data: payload });
      } else {
        await createUser.mutateAsync(payload);
      }
      navigate("/users");
    } catch {}
  };

  const handleToggleStatus = () => {
    if (userId === undefined) return;
    toggleStatus.mutate(userId, {
      onSuccess: (res) => {
        setValue(
          "accountStatus",
          STATUS_TO_FORM[res.data.data.userStatus] ?? "",
          { shouldDirty: true },
        );
        setDeactivateOpen(false);
      },
    });
  };

  const title = isEdit ? "Edit User" : "Add User";
  const notFound = isEdit && !isLoading && (isError || !user);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          items={[
            { label: "Administration", href: "/administration" },
            { label: "Users", href: "/users" },
            { label: title },
          ]}
        />
        <PageHeader
          title={title}
          description={
            isEdit
              ? "Update account details, role and permission."
              : "Create account with role and permission."
          }
        />
      </div>

      <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
        {isEdit && isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LuLoaderCircle className="size-6 animate-spin text-gray-400" />
          </div>
        ) : notFound ? (
          <div className="mt-10 flex flex-col items-start gap-4">
            <p className="text-gray-600">This user could not be found.</p>
            <LightButton className="w-40" onClick={() => navigate("/users")}>
              Back to Users
            </LightButton>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "grid items-start gap-6",
                isEdit && "xl:grid-cols-[minmax(0,1fr)_370px]",
              )}
            >
              <div className="flex flex-col gap-6">
                <FormSection title="Personal / Account Information">
                  <FormField label="Full Name" error={errors.fullName?.message}>
                    <FormInput
                      placeholder="e.g. Rajesh Singh"
                      {...register("fullName")}
                    />
                  </FormField>

                  <FormField label="Username" error={errors.username?.message}>
                    <FormInput
                      placeholder="rajeshsingh"
                      {...register("username")}
                    />
                  </FormField>

                  <FormField label="Email" error={errors.email?.message}>
                    <FormInput
                      type="email"
                      placeholder="name@organization.com"
                      {...register("email")}
                    />
                  </FormField>

                  <FormField label="Phone Number" error={errors.phone?.message}>
                    <FormInput
                      type="tel"
                      placeholder="+97798601231234"
                      {...register("phone")}
                    />
                  </FormField>

                  <FormField
                    label="Organization"
                    error={errors.organization?.message}
                  >
                    <Controller
                      name="organization"
                      control={control}
                      render={({ field }) => (
                        <FilterSelect
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("primaryRole", "", {
                              shouldValidate: false,
                            });
                          }}
                          options={orgOptions}
                          placeholder="Select organization"
                          className="h-11!"
                          emptyMessage="No organizations available yet"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Account Status"
                    error={errors.accountStatus?.message}
                  >
                    <Controller
                      name="accountStatus"
                      control={control}
                      render={({ field }) => (
                        <FilterSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={ACCOUNT_STATUS_OPTIONS}
                          placeholder="Select status"
                          className="h-11!"
                        />
                      )}
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Role Assignment">
                  <FormField
                    label="Assign Role"
                    error={errors.primaryRole?.message}
                  >
                    <Controller
                      name="primaryRole"
                      control={control}
                      render={({ field }) => (
                        <FilterSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={roleOptions}
                          placeholder={
                            !organization
                              ? "Select an organization first"
                              : roleOptions.length === 0
                                ? "No roles for this organization"
                                : "Select role"
                          }
                          disabled={!organization || roleOptions.length === 0}
                          className="h-11!"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Select Project"
                    hint="Optional"
                    error={errors.project?.message}
                  >
                    <Controller
                      name="project"
                      control={control}
                      render={({ field }) => (
                        <FilterSelect
                          value={field.value ?? ""}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("packageIds", []);
                          }}
                          options={projectOptions}
                          placeholder="Select project"
                          className="h-11!"
                          emptyMessage="No projects available yet"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Select Packages"
                    hint="Optional"
                    error={errors.packageIds?.message}
                  >
                    <Controller
                      name="packageIds"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={packageOptions}
                          placeholder={
                            !selectedProject
                              ? "Select a project first"
                              : packageOptions.length === 0
                                ? "No packages in this project"
                                : "Select packages"
                          }
                        />
                      )}
                    />
                  </FormField>
                </FormSection>
              </div>

              {isEdit && user && (
                <UserSidePanel
                  user={user}
                  active={isActive}
                  onResendActivation={() => {
                    /* TODO: resend activation API */
                  }}
                  onResetPassword={() => {
                    /* TODO: reset password API */
                  }}
                  onDeactivate={() => setDeactivateOpen(true)}
                />
              )}
            </div>

            <div className="mt-6 flex shrink-0 justify-end gap-4 pb-8">
              <LightButton className="w-60" onClick={() => navigate("/users")}>
                Cancel
              </LightButton>
              <DarkButton
                icon={FiSave}
                className="w-60 gap-2"
                loading={saving}
                loadingText={isEdit ? "Saving..." : "Creating..."}
                onClick={handleSubmit(onSubmit)}
              >
                {isEdit ? "Save Changes" : "Create User"}
              </DarkButton>
            </div>
          </>
        )}
      </div>

      <ConfirmAlertDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={isActive ? "Deactivate this account?" : "Activate this account?"}
        description={
          isActive
            ? `${user?.fullName ?? "This user"} will no longer be able to log in until the account is reactivated.`
            : `${user?.fullName ?? "This user"} will be able to log in again.`
        }
        confirmText={isActive ? "Deactivate" : "Activate"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
};

export default AddEditUser;
