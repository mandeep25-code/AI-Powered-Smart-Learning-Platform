import axios from "axios";

// Production requests go through Vercel's same-origin /api rewrite to Render,
// avoiding browser CORS failures on Vercel preview and production domains.
const configuredBackendUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
const backendUrl = process.env.NODE_ENV === "production" ? "" : configuredBackendUrl;

const api = axios.create({
  baseURL: `${backendUrl}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes("/auth/")) {
      localStorage.removeItem("sl_token");
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        // soft redirect
      }
    }
    return Promise.reject(err);
  }
);

export const apiErr = (e, fallback = "Something went wrong") =>
  e?.response?.data?.error || e?.response?.data?.detail || e?.message || fallback;

export default api;
