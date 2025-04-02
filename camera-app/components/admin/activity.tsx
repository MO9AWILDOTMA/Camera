import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Film, Clock, Building, Ticket, Users } from "lucide-react";
import { activityApi } from "@/lib/api";
import { formatDistanceToNow, parseISO } from "date-fns";

export type ActivityType = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: Type;
  icon?: any;
};

export type Type =
  | "MOVIE"
  | "USER"
  | "SHOWTIME"
  | "SCREENING_ROOM"
  | "RESERVATION";

export function getIcon(type: Type) {
  switch (type) {
    case "MOVIE":
      return Film;

    case "USER":
      return Users;

    case "SHOWTIME":
      return Clock;

    case "SCREENING_ROOM":
      return Building;

    case "RESERVATION":
      return Ticket;

    default:
      return Film;
  }
}

/**
 * Formats a timestamp to relative time (e.g., "2 hours ago")
 */
function formatTimeAgo(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting time:", error);
    return timestamp;
  }
}

const Activity = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await activityApi.getAll(1, 6);
        let data = response.data;

        data = data.map((a: ActivityType) => ({
          ...a,
          icon: getIcon(a.type),
        }));

        setActivities(data || []);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center p-6">
              <div className="text-4xl mb-2">😊</div>
              <p className="text-lg font-medium text-gray-800">
                No Activities Yet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <div className="hidden sm:block text-sm text-muted-foreground">
          Last updated: {formatTimeAgo(new Date().toISOString())}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon || Film;

            return (
              <div className="flex items-center gap-3 lg:flex-nowrap md:flex-nowrap flex-wrap md:gap-4 overflow-hidden group hover:bg-gray-50 p-2 rounded-md transition-colors">
                <div
                  key={activity.id || index}
                  className="flex items-center gap-3  md:gap-4 overflow-hidden group hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <div className="rounded-full bg-primary/10 p-2 shrink-0">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ml-auto shrink-0">
                  {formatTimeAgo(activity.time)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Activity;
