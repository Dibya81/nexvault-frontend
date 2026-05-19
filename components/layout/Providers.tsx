"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(19, 19, 31, 0.95)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            color: "#fff",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </>
  );
}
