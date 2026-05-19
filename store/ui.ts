"use client";

import { create } from "zustand";
import { Notification } from "@/types";

interface UIStore {
  sidebarOpen: boolean;
  notifications: Notification[];
  hologramIntensity: number;
  particleDensity: number;

  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  setHologramIntensity: (intensity: number) => void;
  setParticleDensity: (density: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  notifications: [],
  hologramIntensity: 0.5,
  particleDensity: 0.5,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 15);
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id, timestamp: Date.now() },
      ],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  setHologramIntensity: (intensity) => set({ hologramIntensity: intensity }),
  setParticleDensity: (density) => set({ particleDensity: density }),
}));
