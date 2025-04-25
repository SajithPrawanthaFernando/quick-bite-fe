"use client";

import * as Label from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRef, useEffect } from "react";
import { HowItWorksSection, WhyQuickBiteSection } from "@/components";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useToast } from "@/components/ToastProvider";
import { signupUser } from "@/redux/actions/authActions";

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    ),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^94\d{9}$/,
      "Phone number must start with 94 and contain 11 digits"
    )
    .required("Phone number is required"),
});

export default function RestaurantOwnerRegisterPage() {
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  const dispatch = AppDispatch();
  const { showToast } = useToast();

  const onSubmit = async (data: any) => {
    const payload = {
      email: data.email,
      phone: data.phone,
      firstname: data.firstName,
      lastname: data.lastName,
      fullname: `${data.firstName} ${data.lastName}`,
      roles: ["restaurantOwner"],
      password: data.password,
    };

    try {
      await dispatch(signupUser(payload));
      showToast(
        "Registration successful",
        "Our team will get in touch with you."
      );
      reset();
    } catch (error) {
      showToast("Registration failed", "Please try again later.", "error");
    }
  };

  return (
    <>
      <div className="flex min-h-[95vh] mt-[72px]">
        {/* Left image section */}
        <div
          className="hidden md:flex flex-col justify-center items-start text-white px-10 w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/owner.jpg')" }}
        >
          <div className="pl-[110px] ">
            <h1 className="text-[60px] font-bold mb-4 leading-[1.1]">
              Unlock a new <br /> revenue stream
            </h1>
            <p className="text-[16px] text-gray-200 max-w-sm">
              QuickBite gives you the flexibility, visibility, and customer
              reach you need to grow. Join us and serve more customers.
            </p>
          </div>
        </div>

        {/* Right form section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-6 pb-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
          >
            <h2 className="text-2xl font-semibold text-black">Get started</h2>

            {/* First & Last Name */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label.Root
                  className="text-[15px] font-medium text-gray-700"
                  htmlFor="firstName"
                >
                  First name
                </Label.Root>
                <input
                  {...register("firstName")}
                  id="firstName"
                  className={`mt-1 w-full border px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <Label.Root
                  className="text-[15px] font-medium text-gray-700"
                  htmlFor="lastName"
                >
                  Last name
                </Label.Root>
                <input
                  {...register("lastName")}
                  id="lastName"
                  className={`mt-1 w-full border px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label.Root
                className="text-[15px] font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </Label.Root>
              <input
                {...register("email")}
                id="email"
                className={`mt-1 w-full border px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label.Root
                className="text-[15px] font-medium text-gray-700"
                htmlFor="phone"
              >
                Mobile phone number
              </Label.Root>
              <input
                {...register("phone")}
                id="phone"
                placeholder="+94 712 345 678"
                className={`mt-1 w-full border px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label.Root
                className="text-[15px] font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </Label.Root>
              <input
                type="password"
                {...register("password")}
                id="password"
                className={`mt-1 w-full border px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-[#FDB940] text-white hover:text-black font-medium py-3 rounded-md transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <WhyQuickBiteSection />
      <HowItWorksSection />
    </>
  );
}
