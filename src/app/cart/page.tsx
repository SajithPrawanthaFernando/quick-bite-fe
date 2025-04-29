"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/redux/actions/cartActions";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";
//import { restaurantApi } from '@/lib/api'; // Import restaurant API

const DELIVERY_FEE = 150;

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { cart, loading } = useSelector((state: RootState) => state.cart);

  const [restaurant, setRestaurant] = useState<any>(null); // New: store restaurant info

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    // Fetch restaurant after cart loads
    // const fetchRestaurant = async () => {
    //   if (cart.length > 0 && cart[0].restaurantId) {
    //     try {
    //       const res = await restaurantApi.get(`/restaurants/${cart[0].restaurantId}`);
    //       setRestaurant(res.data);
    //     } catch (error) {
    //       console.error('Failed to fetch restaurant info:', error);
    //     }
    //   }
    // };
    // fetchRestaurant();
  }, [cart]);

  const increaseQuantity = (itemId: string, currentQuantity: number) => {
    dispatch(updateCartItemQuantity(itemId, currentQuantity + 1));
  };

  const decreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateCartItemQuantity(itemId, currentQuantity - 1));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeCartItem(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const goToCheckout = () => {
    router.push("/checkout");
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + DELIVERY_FEE;

  return (
    <div
      className={`px-40 ${cart.length === 0 ? "pt-40" : "pt-[100px]"} bg-white`}
    >
      <h1
        className={`text-3xl font-bold text-black mb-6 ${
          cart.length === 0 ? "text-center" : "text-left"
        }`}
      >
        Your Cart
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-yellow-300/50 rounded-xl p-6 shadow-sm">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center border-b py-4 last:border-b-0"
                >
                  {/* Left: Item Info */}
                  <div>
                    <h2 className="font-semibold text-black">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      Rs.{item.price} × {item.quantity} ={" "}
                      <span className="font-semibold text-black">
                        Rs.{item.price * item.quantity}
                      </span>
                    </p>
                  </div>

                  {/* Right: Quantity & Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-full px-2">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.itemId, item.quantity)
                        }
                        className="p-1 text-black"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 text-sm font-medium text-black/70">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          increaseQuantity(item.itemId, item.quantity)
                        }
                        className="p-1 text-black"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white border border-yellow-300/50 rounded-xl p-6 shadow-sm h-fit text-black/80">
            <h2 className="text-lg font-semibold text-black mb-4 text-center">
              🛒 Cart Summary
            </h2>

            <div className="text-sm mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>Rs.{subtotal}</span>
            </div>
            <div className="text-sm mb-4 flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs.{DELIVERY_FEE}</span>
            </div>
            <hr className="my-2" />
            <div className="text-lg font-bold mt-4 flex justify-between text-black">
              <span>Total</span>
              <span>Rs.{total}</span>
            </div>

            <button
              onClick={goToCheckout}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 rounded-full text-sm transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleClearCart}
              className="mt-3 w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2.5 rounded-full text-sm transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
