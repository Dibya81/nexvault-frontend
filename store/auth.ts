"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, getApiError } from "@/lib/api";

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthStore extends AuthState {
  /** Sign in with email + password → stores JWT */
  login: (email: string, password: string) => Promise<void>;
  /** Register new account, then auto-login */
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(email, password) as any;
          // Backend returns: { access_token, token_type, expires_in, user }
          const token = response.access_token;
          const user: User = response.user;
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          // Step 1: register account
          await authApi.register(username, email, password);
          // Step 2: auto-login
          const response = await authApi.login(email, password) as any;
          const token = response.access_token;
          const user: User = response.user;
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const user = await authApi.me() as any;
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "cybercloud-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
