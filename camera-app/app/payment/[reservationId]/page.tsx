"use client";

import React, { useState, useEffect, use } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Reservation from "@/models/reservation.model";
import Payment from "@/models/payment.model";
import { paymentsApi, reservationsApi } from "@/lib/api";
import CheckoutForm from "../checkout";
import PaymentSuccess from "../success";
import Loading from "@/app/loading";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GlobalLayout from "@/components/home/layout";
import PaymentFailure from "../failure";

// Load Stripe outside of component render to avoid recreating the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PK_TEST_KEY!);

// Main Checkout Page Component
const CheckoutPage = ({ params }: { params: any }) => {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const unwrapedParams: any = use(params);
  const reservationId = unwrapedParams.reservationId;

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const resp = await reservationsApi.getById(reservationId);
        setReservation(resp.data);
      } catch (error) {
        console.error("Failed to fetch showtime and seats:", error);
        toast({
          title: "Error",
          description: "Failed to load booking information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  });

  // useEffect(() => {
  //   // Check if we're returning from a redirect flow
  //   if (router.query.payment_intent_client_secret) {
  //     const clientSecret = router.query.payment_intent_client_secret as string;

  //     const checkStatus = async () => {
  //       const stripe = await stripePromise;

  //       if (!stripe) {
  //         setError("Your payment was not completed successfully.");
  //         setPaymentStatus("failed");
  //         return;
  //       }
  //       const { paymentIntent } =
  //         await stripe.retrievePaymentIntent(clientSecret);
  //       if (!stripe || !paymentIntent) {
  //         setError("Your payment was not completed successfully.");
  //         setPaymentStatus("failed");
  //         return;
  //       }

  //       if (paymentIntent.status === "succeeded") {
  //         // Fetch the payment details from your backend
  //         try {
  //           const resp = await paymentsApi.create(payment);
  //           const data = resp.data;
  //           setPayment(data.payment);
  //           setPaymentStatus("success");
  //         } catch (err) {
  //           setError(
  //             "Payment completed but we could not retrieve your ticket details."
  //           );
  //           setPaymentStatus("failed");
  //         }
  //       } else {
  //         setError("Your payment was not completed successfully.");
  //         setPaymentStatus("failed");
  //       }
  //     };

  //     checkStatus();
  //   }
  // }, [router.query]);

  const handleSuccess = (paymentData: Payment) => {
    setPayment(paymentData);
    setPaymentStatus("success");
  };

  const handleError = (message: string) => {
    setError(message);
    setPaymentStatus("failed");
  };

  const handleRetry = () => {
    setPaymentStatus("pending");
    setError("");
  };

  if (loading) return <Loading />;

  if (!reservation) {
    return (
      <GlobalLayout>
        <div className="container mx-auto px-4 h-screen flex items-center flex-col pt-44">
          <h1 className="text-2xl font-bold">Showtime not found</h1>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        {paymentStatus === "pending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Reservation Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-30 bg-gray-200 rounded overflow-hidden">
                    {/* {reservation.showtime.movie.picturePaths.length > 0 && (
                    <img
                      src={reservation.showtime.movie.posterUrl}
                      alt={reservation.showtime.movie.title}
                      className="w-full h-full object-cover"
                    />
                  )} */}
                  </div>
                  {/* <div>
                  <h3 className="font-medium">
                    {reservation.showtime.movie.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(reservation.showtime.dateTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservation.showtime.showVersion} •{" "}
                    {reservation.showtime.screeningRoom.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Seat: {reservation.seat}
                  </p>
                </div> */}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  reservation={reservation}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </Elements>
            </div>
          </div>
        )}

        {paymentStatus === "success" && payment && (
          <PaymentSuccess reservation={payment.reservation} />
        )}

        {paymentStatus === "failed" && (
          <PaymentFailure error={error} onRetry={handleRetry} />
        )}
      </div>
    </GlobalLayout>
  );
};

export default CheckoutPage;
