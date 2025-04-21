"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Avatar from "@radix-ui/react-avatar";
import { LogOut, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { getUsers, updateUser } from "@/redux/actions/usersActions";
import { AppDispatch } from "@/hooks/reduxHooks";
import { RootState } from "@/redux/store";
import { logoutUser } from "@/redux/actions/authActions";
import { useToast } from "../ToastProvider";

export const UserProfileModal = ({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  trigger?: React.ReactNode;
}) => {
  const avatar = "/images/user.jpg";
  const dispatch = AppDispatch();
  const [editMode, setEditMode] = useState(false);

  const schema = yup.object().shape({
    fullname: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const users = useSelector((state: RootState) => state.user.users);
  const user = users[0];

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    if (!user?._id) return;
    await dispatch(updateUser(user._id, data));
    setEditMode(false);
  };
  const { showToast } = useToast();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    showToast("Logged out", "You have been successfully logged out.");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-sm transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-6 rounded-lg shadow-xl modal-animation data-[state=open]:modal-open"
        >
          <Dialog.Title className="text-xl font-semibold text-black mb-2">
            Profile
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Manage your account information
          </Dialog.Description>

          {/* Avatar & Info */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <Avatar.Root className="inline-flex h-24 w-24 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Avatar.Image
                src={avatar}
                alt={user?.fullname || "User"}
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback
                delayMs={600}
                className="text-2xl font-bold text-black"
              >
                {(user?.fullname || user?.firstname || "")
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")}
              </Avatar.Fallback>
            </Avatar.Root>

            <div className="w-full px-4">
              {editMode ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 w-full"
                >
                  <input
                    id="fullname"
                    placeholder="Full Name"
                    {...register("fullname")}
                    className={`mt-1 border w-full rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                      errors.fullname ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fullname && (
                    <p className="text-xs text-red-500 text-left">
                      {errors.fullname.message}
                    </p>
                  )}

                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className={`mt-1 border w-full rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 text-left">
                      {errors.email.message}
                    </p>
                  )}

                  <input
                    id="phone"
                    {...register("phone")}
                    type="phone"
                    placeholder="Phone"
                    className={`mt-1 border w-full rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 text-left">
                      {errors.phone.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-[#FDB940] hover:text-black transition"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-black">
                    {user?.fullname ||
                      `${user?.firstname || ""} ${user?.lastname || ""}`}
                  </h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-[#FDB940] text-black rounded-full">
                    {user?.roles?.[0] || "User"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-4 mt-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium text-black transition"
            >
              <Pencil className="w-4 h-4" />
              {editMode ? "Cancel" : "Edit"}
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 flex group items-center justify-center gap-2 px-4 py-2 bg-black hover:bg-[#FDB940] text-white hover:text-black rounded-md text-sm font-medium transition"
            >
              <LogOut className="w-4 h-4 text-white group-hover:text-black transition" />
              Logout
            </button>
          </div>

          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <X
                className="w-5 h-5"
                onClick={() => {
                  setEditMode(false);
                }}
              />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
