import axios from "axios";

// Use the configured backend when present. Vercel also rewrites same-origin
// /api requests to Render, which keeps production auth working if the
// environment variable was not configured when the frontend was built.
const backendUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

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
