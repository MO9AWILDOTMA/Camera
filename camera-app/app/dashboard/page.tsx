"use client";

import { ActivityType, Type, getIcon } from "@/components/admin/activity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-provider";
import Reservation from "@/models/reservation.model";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { activityApi, reservationsApi, showtimesApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Showtime from "@/models/showtime.model";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [activities, setActivities] = useState<Partial<ActivityType>[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAuthenticated) {
        router.push("/auth?redirect=/dashboard");
      }

      try {
        const activitiesResp = await activityApi.getMyActivities(user!.id);
        const reservationResp = await reservationsApi.getUserReservation(
          user!.id
        );
        const showtimesResp = await showtimesApi.getAll(1, 6);

        setActivities(activitiesResp.data || []);
        setReservations(reservationResp.data || []);
        setShowtimes(showtimesResp.data || []);
      } catch (error) {
        console.error("Failed fetching dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, router]);

  if (loading) return <Loading />;

  // Get upcoming reservations (sorted by date)
  const upcomingReservations = reservations
    .filter(
      (reservation) => new Date(reservation.showtime.dateTime) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.showtime.dateTime).getTime() -
        new Date(b.showtime.dateTime).getTime()
    );

  // Format price for display
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Calculate total price
  const calculateTotal = (reservation: Reservation) => {
    const total = reservation.seats.length * reservation.showtime.price;
    return Number(total.toFixed(2));
  };

  // Format date for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE 'at' h:mm a");
  };

  // Get recent activities (sorted by date)
  const recentActivities = activities
    .filter((activity) => activity.time)
    .sort((a, b) => new Date(b.time!).getTime() - new Date(a.time!).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Reservations</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingReservations.length > 0 ? (
              upcomingReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{reservation.showtime.movie.name}</CardTitle>
                    <CardDescription>
                      {formatDateTime(reservation.showtime.dateTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>{reservation.showtime.screeningRoom.name} • Screen </p>
                      <p className="mt-2">
                        Seats: {reservation.seats.join(", ")}
                      </p>
                      <div className="mt-4 flex justify-between">
                        <span className="font-medium">Total</span>
                        <span>{formatPrice(calculateTotal(reservation))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No upcoming reservations found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {activity.title}
                    </CardTitle>
                    <CardDescription>
                      {activity.time
                        ? format(new Date(activity.time), "d MMM yyyy")
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>{activity.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent activities found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showtimes.length > 0 ? (
              showtimes.map((showtime) => (
                <Card key={showtime.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{showtime.movie.name}</CardTitle>
                    <CardDescription>
                      {showtime.isPreview
                        ? "Preview"
                        : showtime.isSpecialEvent
                          ? "Special Event"
                          : "Now Showing"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>
                        {showtime.movie.genres.length > 0
                          ? `Based on your interest in ${showtime.movie.genres[0].toLowerCase().replace("_", " ")} movies`
                          : "Recommended for you"}
                      </p>
                      <p className="mt-2">
                        {format(
                          new Date(showtime.dateTime),
                          "EEE, MMM d, h:mm a"
                        )}{" "}
                        • {formatPrice(showtime.price)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No recommendations available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
