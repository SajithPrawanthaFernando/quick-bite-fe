'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '@/redux/actions/cartActions';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
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
    router.push('/checkout');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24">
      <h1 className="text-2xl font-bold text-black mb-6 text-center">Your Cart</h1>

      {/* Restaurant Info */}
      {restaurant && (
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-black">{restaurant.name}</h2>
          <p className="text-gray-600">{restaurant.address}</p>
          {/* If you have logo URL from backend: */}
          {/* <img src={restaurant.logoUrl} alt="Restaurant Logo" className="w-20 mx-auto mt-3" /> */}
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white border border-yellow-300/50 rounded-xl p-6">
              {cart.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between py-4 border-b last:border-b-0">
                  <div>
                    <h2 className="font-semibold text-black">{item.name}</h2>
                    <p className="text-gray-600 text-sm">
                      Rs.{item.price} × {item.quantity} = <b>Rs.{item.price * item.quantity}</b>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-full px-2">
                      <button
                        onClick={() => decreaseQuantity(item.itemId, item.quantity)}
                        className="p-1 text-black"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.itemId, item.quantity)}
                        className="p-1 text-black"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white border border-yellow-300/50 rounded-xl p-6 h-fit">
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
            <hr />
            <div className="text-lg font-bold mt-4 flex justify-between">
              <span>Total</span>
              <span>Rs.{total}</span>
            </div>

            <button
              onClick={goToCheckout}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-full text-sm transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={handleClearCart}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 rounded-full text-sm transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
