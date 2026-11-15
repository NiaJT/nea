import axios from "axios";
import { AUTH_PATHS } from "./utils/paths";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const LOGIN_ROUTE = "/login";
const PUBLIC_ROUTES = [LOGIN_ROUTE, "/forgotPassword", "/reset-password"];
export const SESSION_EXPIRED_KEY = "session_expired";

const redirectToLogin = () => {
  setLoggedOut(true);
  if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
    window.location.href = LOGIN_ROUTE;
  }
};

const REFRESH_EXEMPT_PATHS = [AUTH_PATHS.login, AUTH_PATHS.refresh];

const LOGGED_OUT_KEY = "is_logged_out";

export const setLoggedOut = (value: boolean) => {
  if (value) {
    localStorage.setItem(LOGGED_OUT_KEY, "1");
  } else {
    localStorage.removeItem(LOGGED_OUT_KEY);
  }
};

export const isLoggedOut = () => localStorage.getItem(LOGGED_OUT_KEY) === "1";

// compare the path only (no query string) and match from the end,
// so a short exempt path can't match unrelated endpoints
const isExemptUrl = (url: string) => {
  const path = url.split("?")[0].replace(/\/+$/, "");
  return REFRESH_EXEMPT_PATHS.some((p) => path.endsWith(p.replace(/\/+$/, "")));
};

type Subscriber = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshSubscribers: Subscriber[] = [];

const subscribeTokenRefresh = (subscriber: Subscriber) => {
  refreshSubscribers.push(subscriber);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((s) => s.resolve());
  refreshSubscribers = [];
};

const onRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach((s) => s.reject(error));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;
    const requestUrl: string = originalRequest?.url ?? "";
    const isRefreshExempt = isExemptUrl(requestUrl);

    if (
      error?.response?.status === 403 &&
      error.response?.data?.error?.toLowerCase() === "access denied"
    ) {
      window.location.href = "/forbidden";
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && (isRefreshExempt || isLoggedOut())) {
      return Promise.reject(error);
    }

    if (
      error?.response?.status === 401 &&
      !isRefreshExempt &&
      !isLoggedOut() &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await navigator.locks.request("auth-refresh", () =>
          api.post(AUTH_PATHS.refresh),
        );
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshFailed(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { api };
