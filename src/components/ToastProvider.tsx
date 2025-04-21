"use client";

import * as Toast from "@radix-ui/react-toast";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastVariant = "success" | "error";

interface ToastContextType {
  showToast: (
    title: string,
    description: string,
    variant?: ToastVariant
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("success");

  const showToast = (
    title: string,
    description: string,
    variant: ToastVariant = "success"
  ) => {
    setTitle(title);
    setDescription(description);
    setVariant(variant);
    setOpen(true);
  };

  const borderColor =
    variant === "error" ? "border-red-500" : "border-[#FDB940]";
  const titleColor = variant === "error" ? "text-red-600" : "text-[#FDB940]";

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`w-[360px] bg-white shadow-md rounded-md p-4 flex flex-col gap-1 z-[9999] fixed bottom-6 right-6 border-l-4 ${borderColor}`}
        >
          <div className="flex items-start justify-between">
            <div className={`font-semibold text-[16px] ${titleColor}`}>
              {title}
            </div>
            <Toast.Close className="text-gray-400 hover:text-gray-600 text-sm">
              ✕
            </Toast.Close>
          </div>
          <div className="text-gray-700 text-sm">{description}</div>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4 z-[9999]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
