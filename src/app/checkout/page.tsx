"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { createOrder } from "@/redux/actions/orderAction";
import { useRouter } from "next/navigation";
import { PaymentModal } from "@/components/modals/PaymentModal";
//import { restaurantApi } from '@/lib/api'; // Import Restaurant API

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
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(subtotal + DELIVERY_FEE);

      // const fetchRestaurant = async () => {
      //   try {
      //     const res = await restaurantApi.get(`/restaurants/${cart[0].restaurantId}`);
      //     setRestaurant(res.data);
      //   } catch (error) {
      //     console.error('Failed to fetch restaurant:', error);
      //   }
      // };

      //fetchRestaurant();
    }
  }, [cart]);

  const handleCheckout = () => {
    if (
      !houseNumber.trim() ||
      !lane1.trim() ||
      !city.trim() ||
      !district.trim()
    ) {
      alert("Please fill all required delivery address fields!");
      return;
    }
    setOpen(true); // JUST open modal
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 p-6">
      {/* Restaurant Info */}
      {restaurant && (
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-black">{restaurant.name}</h2>
          <p className="text-gray-600">{restaurant.address}</p>
          {/* Optional logo */}
          {/* <img src={restaurant.logoUrl} alt="Restaurant Logo" className="w-20 mx-auto mt-4" /> */}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Delivery Address Section */}
        <div className="bg-white border border-yellow-300/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Delivery Address
          </h2>

          <input
            type="text"
            placeholder="House Number"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Lane 1"
            value={lane1}
            onChange={(e) => setLane1(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Lane 2 (Optional)"
            value={lane2}
            onChange={(e) => setLane2(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded text-sm"
          />
        </div>

        {/* Order Summary Section */}
        <div className="bg-white border border-yellow-300/50 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-black mb-4 text-center">
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

          <div className="flex justify-between font-bold text-lg mt-4 text-black">
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
