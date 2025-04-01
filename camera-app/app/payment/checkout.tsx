"use client";

import { paymentsApi } from "@/lib/api";
import Payment from "@/models/payment.model";
import Reservation from "@/models/reservation.model";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

// CheckoutForm Component
const CheckoutForm = ({
  reservation,
  onSuccess,
  onError,
}: {
  reservation: Reservation;
  onSuccess: (payment: Payment) => void;
  onError: (message: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const { showtime, ticket } = reservation;

  // Calculate total amount
  const calculateTotal = () => {
    const basePrice = showtime.price;
    // Apply any discounts if needed
    if (showtime.discounts && showtime.discounts.length > 0) {
      // For simplicity, just applying the first discount
      const discount = showtime.discounts[0].percentage / 100;
      return basePrice * (1 - discount);
    }
    return basePrice;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setCardError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send to your backend
      const resp = await paymentsApi.create({
        paymentMethodId: paymentMethod.id,
        amount: calculateTotal(),
        reservationId: reservation.id,
      });
      const data = resp.data;

      // If payment requires additional actions like 3D Secure
      if (data.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.clientSecret
        );
        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      // Success!
      onSuccess(data.payment);
    } catch (err: any) {
      setCardError(err.message || "An unexpected error occurred");
      onError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {cardError && <p className="mt-2 text-sm text-red-600">{cardError}</p>}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
        <div className="mt-2 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            {/* <p className="text-gray-600">Ticket ({ticket.type})</p> */}
            <p className="text-gray-900">${showtime.price.toFixed(2)}</p>
          </div>

          {showtime.discounts && showtime.discounts.length > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <p className="text-gray-600">
                Discount ({showtime.discounts[0].name})
              </p>
              <p className="text-red-600">
                -$
                {(
                  (showtime.price * showtime.discounts[0].percentage) /
                  100
                ).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t border-gray-200">
            <p>Total</p>
            <p>${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {loading ? "Processing..." : `Pay $${calculateTotal().toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
