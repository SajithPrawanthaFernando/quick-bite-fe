"use client";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { notFound } from "next/navigation";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllUsers } from "@/redux/actions/usersActions";
import { AppDispatch } from "@/redux/store";

export default function OverviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.roles?.includes("admin")) {
        dispatch(
          loginSuccess({
            token,
            user: parsedUser,
          })
        );
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setCheckingAuth(false);
  }, [dispatch]);

  const cards = [
    {
      label: "Total Users",
      value: users.length,
      growth: "+12%",
      bgColor: "bg-[#FDB940]",
      icon: "👤",
    },
    {
      label: "Total Orders",
      value: "48,210",
      growth: "+22%",
      bgColor: "bg-[#1E2A52]",
      icon: "🛒",
    },
    {
      label: "Pending Orders",
      value: "2,145",
      growth: "-8%",
      bgColor: "bg-violet-500",
      icon: "⏳",
    },
    {
      label: "Completed Orders",
      value: "45,789",
      growth: "+18%",
      bgColor: "bg-[#38A169]",
      icon: "✅",
    },
    {
      label: "Total Revenue",
      value: "$1,254,000",
      growth: "+30%",
      bgColor: "bg-[#3182CE]",
      icon: "💰",
    },
    {
      label: "Refunds Issued",
      value: "$12,400",
      growth: "-5%",
      bgColor: "bg-[#E53E3E]",
      icon: "🔄",
    },
  ];

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center mt-[100px]">
        <Image
          src="/images/ripples.svg"
          alt="loading"
          width={160}
          height={160}
        />
      </div>
    );
  }

  if (!isAuthorized) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-black">Welcome, Admin</h1>
      <p className="text-gray-500 mb-6">
        You have <span className="text-orange-500 font-medium">200+</span>{" "}
        orders today.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-6">
        You have <span className="font-semibold">12 owner requests</span>{" "}
        pending approval.{" "}
        <span className="text-blue-500 underline cursor-pointer">
          Accept Now
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg text-white shadow-md ${card.bgColor} p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-sm bg-white text-black rounded px-2">
                {card.growth}
              </span>
            </div>
            <div className="text-lg font-semibold">{card.label}</div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Grid with Top Customers and Dummy Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Customers */}
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-black">Top Customers</h2>
            <button className="text-[#FDB940] text-sm underline">
              View All
            </button>
          </div>
          <ul className="space-y-3">
            {[
              {
                name: "Carlos Curran",
                country: "USA",
                orders: 24,
                amount: "$8,964",
              },
              {
                name: "Stan Gaunter",
                country: "UAE",
                orders: 22,
                amount: "$16,985",
              },
              {
                name: "Richard Wilson",
                country: "Germany",
                orders: 14,
                amount: "$5,366",
              },
              {
                name: "James Bond",
                country: "UK",
                orders: 22,
                amount: "$7,500",
              },
            ].map((customer, i) => (
              <li
                key={i}
                className="flex justify-between items-center text-sm text-black/80"
              >
                <div>
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-gray-500 text-xs">
                    {customer.country} • {customer.orders} Orders
                  </div>
                </div>
                <div className="font-semibold text-black/80">
                  {customer.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pie Chart Dummy */}
        <div className="bg-white p-4 shadow rounded-lg flex flex-col items-center justify-center">
          <h2 className="font-semibold text-lg mb-4 text-black">
            Top Categories
          </h2>
          <div className="w-[160px] h-[160px] rounded-full border-[12px] border-orange-300 relative">
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-600 font-medium">
              Pie Chart
            </div>
          </div>
        </div>

        {/* Statistics Chart Dummy */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold text-lg mb-4 text-black">
            Order Statistics
          </h2>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(49)].map((_, i) => (
              <div
                key={i}
                className={`h-6 w-6 rounded ${
                  i % 7 === 0
                    ? "bg-[#FDB940]"
                    : i % 4 === 0
                    ? "bg-yellow-200"
                    : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
