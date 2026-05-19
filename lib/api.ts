import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000,
      headers: { "Content-Type": "application/json" },
    });

    // Inject token from localStorage (zustand-persist also stores it there)
    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("cybercloud-auth");
          if (raw) {
            const parsed = JSON.parse(raw);
            const token = parsed?.state?.token;
            if (token) config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {}
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("cybercloud-auth");
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, any>) {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.client.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return response.data;
  }

  /** Raw axios instance for special cases */
  raw() {
    return this.client;
  }
}

export const api = new ApiClient();

// ── Auth API — wired to your FastAPI routes ───────────────────────────────────
export const authApi = {
  /** POST /api/auth/login  → { access_token, token_type, expires_in, user } */
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  /** POST /api/auth/register → { id, username, email, created_at } */
  register: (username: string, email: string, password: string) =>
    api.post("/api/auth/register", { username, email, password }),

  /** GET /api/auth/me */
  me: () => api.get("/api/auth/me"),

  /** POST /api/auth/logout */
  logout: () => api.post("/api/auth/logout").catch(() => {}),
};

// ── Files API — wired to your FastAPI routes ──────────────────────────────────
export const filesApi = {
  /** GET /api/files?page=1&per_page=20 */
  list: (page = 1, perPage = 20) =>
    api.get("/api/files", { page, per_page: perPage }),

  /** POST /api/files/upload  (multipart) */
  upload: (
    file: File,
    _parentId?: string,
    onProgress?: (progress: number) => void
  ) => api.upload("/api/files/upload", file, onProgress),

  /** DELETE /api/files/:id */
  delete: (id: string) => api.delete(`/api/files/${id}`),

  /** GET /api/files/:id/download — returns a URL, open directly */
  downloadUrl: (id: string) => `${API_BASE_URL}/api/files/${id}/download`,

  /** GET /api/files/:id/info */
  info: (id: string) => api.get(`/api/files/${id}/info`),
};

// ── Storage/stats API ─────────────────────────────────────────────────────────
export const storageApi = {
  /** Proxied from /api/files/stats or /health */
  stats: () => api.get("/api/files/stats").catch(() => ({
    used: 0, total: 100 * 1024 ** 3, files_count: 0, folders_count: 0, by_type: {},
  })),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get("/health"),
};

// ── Error helper ──────────────────────────────────────────────────────────────
export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d[0]?.msg ?? "Validation error";
    return err.response?.data?.message ?? err.message;
  }
  return "An unexpected error occurred.";
}
