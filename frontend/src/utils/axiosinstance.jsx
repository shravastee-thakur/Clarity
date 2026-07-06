import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/tokens`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;
        const freshUser = res.data.user;

        useAuthStore.getState().setAccessToken(newAccessToken);
        useAuthStore.getState().setIsVerified(true);

        if (freshUser) {
          useAuthStore.getState().setWorkspaceStatus(freshUser.workspaceStatus);
          useAuthStore
            .getState()
            .setActiveWorkspaceId(freshUser.activeWorkspaceId);
          useAuthStore
            .getState()
            .setWorkspaceRole(freshUser.activeWorkspaceRole);
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();

        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
