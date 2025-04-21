"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 rounded-xl shadow-2xl transition-all"
        >
          <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-5">
            Are you sure you want to delete this user? This action is
            <span className="font-semibold text-red-600"> irreversible</span>.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
            >
              Delete
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
