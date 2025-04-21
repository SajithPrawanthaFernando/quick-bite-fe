"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useToast } from "../ToastProvider";
import { changeUserRole } from "@/redux/actions/usersActions";

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  currentRole: string;
}

export const ChangeRoleModal = ({
  open,
  onOpenChange,
  userId,
  currentRole,
}: ChangeRoleModalProps) => {
  const dispatch = AppDispatch();
  const { showToast } = useToast();
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);

    try {
      await dispatch(changeUserRole(userId, role));
      showToast("Role Updated", `User role changed to ${role}`);
      onOpenChange(false);
    } catch (err) {
      showToast("Update Failed", "Could not change user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 rounded-xl shadow-2xl transition-all"
        >
          <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">
            Change User Role
          </Dialog.Title>

          <div className="space-y-3">
            <label className="text-sm text-gray-600 font-medium ">
              Select New Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border mt-1.5 border-gray-300 px-3 py-2 text-[15px] rounded-md text-black focus:ring-[#FDB940] focus:outline-none focus:ring-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="restaurantOwner">Restaurant Owner</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-medium text-gray-700"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#FDB940] hover:text-black text-sm  transition"
            >
              {loading ? "Updating..." : "Update"}
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
