"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { createOrder } from "@/redux/actions/orderAction";
import { fetchCart } from "@/redux/actions/cartActions";

export const PaymentModal = ({
  open,
  onOpenChange,
  trigger,
  deliveryAddress,
  total,
  cart,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  trigger?: React.ReactNode;
  deliveryAddress: any;
  total: number;
  cart: any[];
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (paymentData: any) => {
    const [expMonth, expYearShort] = paymentData.expiry.split("/");
    const expMonthNum = Number(expMonth);
    const expYearNum = Number("20" + expYearShort); // Assuming input is MM/YY

    const body = {
      deliveryAddress,
      charge: {
        amount: total,
        card: {
          cvc: paymentData.cvv,
          exp_month: expMonthNum,
          exp_year: expYearNum,
          number: paymentData.cardNumber.replace(/\s+/g, ""), // remove spaces
        },
      },
      items: cart.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await dispatch(createOrder("680ca51fa95a4a19afc4bd0d", body));
      console.log("Order Placed Successfully", body);
      dispatch(fetchCart());
      router.push("/myOrders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order!");
    } finally {
      onOpenChange(false);
      reset();
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-100 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 
            bg-white p-6 rounded-lg shadow-xl modal-animation"
        >
          <Dialog.Title className="text-xl font-semibold text-black mb-4">
            Payment Details
          </Dialog.Title>

          <Dialog.Description className="text-sm text-gray-500 mb-6">
            Enter your card information to proceed.
          </Dialog.Description>

          {/* Payment logos */}
          <div className="flex items-center justify-start gap-4 mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/MasterCard_early_1990s_logo.svg/1280px-MasterCard_early_1990s_logo.svg.png"
              alt="MasterCard"
              className="h-6"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-6"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1202px-American_Express_logo_%282018%29.svg.png"
              alt="American Express"
              className="h-6"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                {...register("nameOnCard", { required: true })}
                className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.nameOnCard ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nameOnCard && (
                <span className="text-red-500 text-xs mt-1">
                  This field is required
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                {...register("cardNumber", { required: true })}
                maxLength={19} // to allow spaces
                inputMode="numeric"
                className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardNumber && (
                <span className="text-red-500 text-xs mt-1">
                  Card number is required
                </span>
              )}
            </div>

            <div className="flex gap-4 pr-4">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  {...register("expiry", { required: true })}
                  placeholder="MM/YY"
                  className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                    errors.expiry ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expiry && (
                  <span className="text-red-500 text-xs mt-1">Required</span>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  {...register("cvv", { required: true })}
                  maxLength={4}
                  inputMode="numeric"
                  className={`mt-1 border rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940] ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cvv && (
                  <span className="text-red-500 text-xs mt-1">Required</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:text-black text-white py-3 rounded-md hover:bg-[#FDB940] transition-all duration-300"
            >
              Pay Now
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
