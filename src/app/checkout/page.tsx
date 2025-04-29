"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createOrder } from "@/redux/actions/orderAction";
import { useRouter } from "next/navigation";
import { PaymentModal } from "@/components/modals/PaymentModal";

const DELIVERY_FEE = 150;

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cart } = useSelector((state: RootState) => state.cart);

  const [restaurant, setRestaurant] = useState<any>(null);

  const [houseNumber, setHouseNumber] = useState("");
  const [lane1, setLane1] = useState("");
  const [lane2, setLane2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [errors, setErrors] = useState({
    houseNumber: "",
    lane1: "",
    city: "",
    district: "",
  });
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(subtotal + DELIVERY_FEE);
    }
  }, [cart]);

  const validateFields = () => {
    const newErrors = {
      houseNumber: !houseNumber.trim() ? "House number is required" : "",
      lane1: !lane1.trim() ? "Lane 1 is required" : "",
      city: !city.trim() ? "City is required" : "",
      district: !district.trim() ? "District is required" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleCheckout = () => {
    if (!validateFields()) {
      return;
    }
    setOpen(true); // Open modal
  };

  return (
    <div className=" w-screen pt-[100px] p-6 px-40 bg-white text-black ">
      <h1 className="text-3xl font-bold text-black mb-6 text-left">Checkout</h1>
      {restaurant && (
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">{restaurant.name}</h2>
          <p>{restaurant.address}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-yellow-300/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House Number
            </label>
            <input
              type="text"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className={`w-full border p-2 rounded text-sm 
    focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
      errors.houseNumber ? "border-red-500" : "border-gray-300"
    }`}
            />
            {errors.houseNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lane 1
            </label>
            <input
              type="text"
              value={lane1}
              onChange={(e) => setLane1(e.target.value)}
              className={`w-full border p-2 rounded  focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm ${
                errors.lane1 ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lane1 && (
              <p className="text-red-500 text-xs mt-1">{errors.lane1}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lane 2 (Optional)
            </label>
            <input
              type="text"
              value={lane2}
              onChange={(e) => setLane2(e.target.value)}
              className="w-full border  focus:outline-none focus:ring-1 focus:ring-yellow-500 border-gray-300 p-2 rounded text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full border p-2  rounded text-sm  focus:outline-none focus:ring-1 focus:ring-yellow-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full border p-2 rounded  focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm ${
                errors.district ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.district && (
              <p className="text-red-500 text-xs mt-1">{errors.district}</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-yellow-300/50 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-center">
            🛒 Order Summary
          </h2>
          <ul className="mb-4 text-sm">
            {cart.map((item) => (
              <li key={item.itemId} className="flex justify-between py-1">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>Rs.{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-medium border-t pt-3 text-sm">
            <span>Delivery Fee</span>
            <span>Rs.{DELIVERY_FEE}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>Rs.{total}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 rounded-full text-sm transition"
          >
            Place Order
          </button>
        </div>
      </div>

      <PaymentModal
        open={open}
        onOpenChange={setOpen}
        deliveryAddress={{ houseNumber, lane1, lane2, city, district }}
        total={total}
        cart={cart}
      />
    </div>
  );
}
