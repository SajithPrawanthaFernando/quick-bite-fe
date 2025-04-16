"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const SignupModal = ({
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

  const onSubmit = (data: any) => {
    console.log("Signup Data:", data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        {trigger ? trigger : <button>Sign up</button>}
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
            Sign up for QuickBite
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mb-6">
            Create your account to start ordering.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                {...register("name")}
                className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
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
              Sign up
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
