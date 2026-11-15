import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type {
  IApiMessageResponse,
  IApiResponse,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  ILoginResponseData,
  IResetPasswordPayload,
} from "@/type/auth.type";
import requests from "@/helper/requests";
import { errorToast, successToast } from "@/component/common/Toasts";
import { isLoggedOut, setLoggedOut } from "@/api";
import { useNavigate } from "react-router";

export const ME_QUERY_KEY = ["auth", "me"];

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ILoginPayload) => requests.auth.login(data),
    onSuccess: async (res) => {
      setLoggedOut(false);
      queryClient.clear();
      // show something immediately, then replace it with the full /me data
      queryClient.setQueryData(ME_QUERY_KEY, res.data.data);
      await queryClient.fetchQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: async () => (await requests.auth.me()).data.data,
        staleTime: 0,
      });
      successToast("Login successful", res.data.message);
    },
    onError: (error: AxiosError<IApiResponse<null>>) => {
      errorToast("Login failed", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => requests.auth.logout(),
    onSuccess: (res) => {
      setLoggedOut(true);
      queryClient.setQueryData(ME_QUERY_KEY, null);
      successToast("Logged out", res.data.message);
      navigate("/login", { replace: true });
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "auth",
      });
    },
    onError: (error: AxiosError<IApiMessageResponse>) => {
      errorToast("Failed to log out", error);
    },
  });
};

export const useMe = (options?: {
  revalidate?: boolean;
  refetchOnMount?: boolean | "always";
}) => {
  const revalidate = options?.revalidate ?? true;

  return useQuery({
    queryKey: ME_QUERY_KEY,
    enabled: !isLoggedOut(),
    queryFn: async () => (await requests.auth.me()).data.data,
    retry: false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: revalidate,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchInterval: (query) =>
      revalidate && query.state.data ? 15 * 60 * 1000 : false,
    refetchIntervalInBackground: true,
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IChangePasswordPayload) =>
      requests.auth.changePassword(data),
    onSuccess: (res) => {
      queryClient.setQueryData(
        ME_QUERY_KEY,
        (old: ILoginResponseData | undefined) =>
          old ? { ...old, mustChangePassword: false } : old,
      );
      successToast("Password changed", res.data.message);
    },
    onError: (error: AxiosError<IApiMessageResponse>) => {
      errorToast("Failed to change password", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: IForgotPasswordPayload) =>
      requests.auth.forgotPassword(data),
    onSuccess: (res) => {
      successToast("Reset link sent", res.data.message);
    },
    onError: (error: AxiosError<IApiMessageResponse>) => {
      errorToast("Failed to send reset link", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: IResetPasswordPayload) =>
      requests.auth.resetPassword(data),
    onSuccess: (res) => {
      successToast("Password reset", res.data.message);
    },
    onError: (error: AxiosError<IApiMessageResponse>) => {
      errorToast("Failed to reset password", error);
    },
  });
};
