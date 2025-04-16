"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as yup from "yup";
import { useEffect } from "react";

// Updated Validation Schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const DeliveryRiderRegisterModal = ({
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

  const onSubmit = (data: any) => {
    console.log("Rider Registration:", data);
    onOpenChange(false);
    reset(); // reset form after submission
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 
                     bg-white p-6 rounded-lg shadow-xl modal-animation data-[state=open]:modal-open"
        >
          <Dialog.Title className="text-xl font-semibold text-black mb-4">
            Become a Rider
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mb-6">
            Join the QuickBite delivery team today.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                {...register("fullName")}
                className={`mt-1 px-3 py-2 rounded-md border text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
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
                type="email"
                {...register("email")}
                className={`mt-1 px-3 py-2 rounded-md border text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                placeholder="+94 712 345 678"
                {...register("phone")}
                className={`mt-1 px-3 py-2 rounded-md border text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
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
                className={`mt-1 px-3 py-2 rounded-md border text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-[#FDB940] hover:text-black py-3 rounded-md font-medium transition-all duration-300"
            >
              Submit
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
