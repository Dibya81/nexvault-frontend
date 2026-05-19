export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  storage_used: number;
  storage_total: number;
  created_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  parent_id?: string | null;
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
  status: 'pending' | 'uploading' | 'completed' | 'error';
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other';

export interface HologramConfig {
  intensity: number;
  color: string;
  flickerSpeed: number;
  scanLines: boolean;
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  spread: number;
}
