"use client";

import { create } from "zustand";
import { filesApi, storageApi, getApiError } from "@/lib/api";

export interface FileItem {
  id: string;
  original_filename: string;
  stored_filename: string;
  content_type: string;
  size_bytes: number;
  size_human: string;
  owner_id: string;
  upload_date: string;
  // Compatibility shims for components that use old field names
  name?: string;
  type?: string;
  size?: number;
  created_at?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
  parent_id?: string | null;
  file_count: number;
}

export interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  speed: number;
  error?: string;
}

export interface StorageStats {
  total: number;
  used: number;
  free: number;
  files_count: number;
  folders_count: number;
  by_type: Record<string, number>;
}

interface FilesStore {
  files: FileItem[];
  folders: FolderItem[];
  currentFolder: string | null;
  storageStats: StorageStats | null;
  uploads: UploadProgress[];
  isLoading: boolean;
  searchQuery: string;
  viewMode: "grid" | "list";
  selectedItems: string[];
  totalFiles: number;

  fetchFiles: (folderId?: string) => Promise<void>;
  fetchStorageStats: () => Promise<void>;
  addUpload: (upload: UploadProgress) => void;
  updateUpload: (id: string, progress: number, status: UploadProgress["status"]) => void;
  removeUpload: (id: string) => void;
  setCurrentFolder: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  deleteFile: (id: string) => Promise<void>;
  addFileToList: (file: FileItem) => void;
}

/** Map backend FileItem to the shape components expect */
function normalise(f: any): FileItem {
  return {
    ...f,
    // Compatibility shims
    name: f.name ?? f.original_filename,
    type: f.type ?? (f.content_type ?? "").split("/")[0] ?? "other",
    size: f.size ?? f.size_bytes ?? 0,
    created_at: f.created_at ?? f.upload_date,
  };
}

export const useFilesStore = create<FilesStore>((set, get) => ({
  files: [],
  folders: [],
  currentFolder: null,
  storageStats: null,
  uploads: [],
  isLoading: false,
  searchQuery: "",
  viewMode: "grid",
  selectedItems: [],
  totalFiles: 0,

  fetchFiles: async (_folderId) => {
    set({ isLoading: true });
    try {
      const response = await filesApi.list(1, 50) as any;
      const raw = response.files ?? response ?? [];
      const total = response.total ?? raw.length;
      set({
        files: raw.map(normalise),
        totalFiles: total,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchStorageStats: async () => {
    try {
      const stats = await storageApi.stats() as any;
      set({
        storageStats: {
          used: stats.used ?? 0,
          total: stats.total ?? 100 * 1024 ** 3,
          free: (stats.total ?? 100 * 1024 ** 3) - (stats.used ?? 0),
          files_count: stats.files_count ?? stats.files ?? 0,
          folders_count: stats.folders_count ?? 0,
          by_type: stats.by_type ?? {},
        },
      });
    } catch {
      // Swallow — health fallback is in api.ts
    }
  },

  addUpload: (upload) => set((s) => ({ uploads: [...s.uploads, upload] })),

  updateUpload: (id, progress, status) =>
    set((s) => ({
      uploads: s.uploads.map((u) => (u.id === id ? { ...u, progress, status } : u)),
    })),

  removeUpload: (id) =>
    set((s) => ({ uploads: s.uploads.filter((u) => u.id !== id) })),

  setCurrentFolder: (id) => set({ currentFolder: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),

  toggleSelection: (id) =>
    set((s) => ({
      selectedItems: s.selectedItems.includes(id)
        ? s.selectedItems.filter((i) => i !== id)
        : [...s.selectedItems, id],
    })),

  clearSelection: () => set({ selectedItems: [] }),

  deleteFile: async (id) => {
    await filesApi.delete(id);
    set((s) => ({
      files: s.files.filter((f) => f.id !== id),
      totalFiles: Math.max(0, s.totalFiles - 1),
    }));
  },

  addFileToList: (file) =>
    set((s) => ({
      files: [normalise(file), ...s.files],
      totalFiles: s.totalFiles + 1,
    })),
}));
