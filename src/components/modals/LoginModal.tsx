"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { loginUser } from "@/redux/actions/authActions";
import { useToast } from "../ToastProvider";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LoginModal = ({
  open,
  onOpenChange,
  trigger,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  trigger?: React.ReactNode;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const dispatch = AppDispatch();
  const { showToast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const res = await dispatch(loginUser(data.email, data.password));
      showToast("Success", "Login successful!");
      onOpenChange(false);
    } catch (error) {
      showToast(
        "Failed",
        "Login failed. Please check your credentials.",
        "error"
      );
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        {trigger ? trigger : <button>Login</button>}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className={`
            fixed top-1/2 left-1/2 z-100 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 
            bg-white p-6 rounded-lg shadow-xl
            modal-animation 
          `}
        >
          <Dialog.Title className="text-xl font-semibold text-black mb-4">
            Log in to QuickBite
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mb-6">
            Access your saved addresses and orders.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:text-black text-white py-3 rounded-md hover:bg-[#FDB940] transition-all duration-300"
            >
              Log in
            </button>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
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
