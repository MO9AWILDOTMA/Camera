"use client";

import Showtime from "@/models/Showtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface ShowtimeCardProps {
  showtime: Showtime;
  colorTheme?: "orange" | "blue" | "red" | "green"; // Allow customizable color themes
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DASH_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL;

const ShowtimeCard = ({ showtime, colorTheme = "red" }: ShowtimeCardProps) => {
  const router = useRouter();
  const {
    movie,
    slug,
    dateTime,
    price,
    showVersion,
    totalSeats,
    reservedSeats,
    specialEvent,
    preview,
  } = showtime;

  // Format date and time
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Calculate available seats
  const availableSeats = totalSeats - reservedSeats;
  const occupancyPercentage = Math.round((reservedSeats / totalSeats) * 100);

  // Determine theme colors
  const themeColors = {
    orange: "bg-orange-500 text-white",
    blue: "bg-blue-600 text-white",
    red: "bg-red-800 text-white",
    green: "bg-green-600 text-white",
  };

  const bgColor = themeColors[colorTheme];

  function handleNavigation() {
    router.push(`${DASH_URL}/showtimes/${movie.id}`);
  }

  const pictureSrc =
    movie.picturePaths && movie.picturePaths.length > 0
      ? BASE_URL + movie.picturePaths[0]
      : "/image/event.jpeg";

  return (
    <div
      className="w-full mb-6  cursor-pointer transition-transform duration-300 ease-in-out hover:scale-90"
      onClick={handleNavigation}
    >
      <div className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg border border-gray-200">
        {/* Left side vertical label with date/time */}
        <div
          className={`${bgColor} flex flex-col items-center justify-center p-4 w-full md:w-32`}
        >
          <div className="text-xl md:text-2xl font-bold tracking-tight text-center md:transform md:-rotate-90 md:whitespace-nowrap">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 relative bg-black">
          <div className="relative h-96 md:h-96">
            <Image
              src={pictureSrc}
              alt={movie.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Movie details overlay */}
            <div className="absolute right-0 top-0 m-4 flex flex-col gap-1">
              <div className={`${bgColor} px-3 py-1 font-bold`}>
                {movie.name}
              </div>

              {showVersion && (
                <div className={`${bgColor} px-3 py-1 font-bold`}>
                  {showVersion}
                </div>
              )}

              <div className={`${bgColor} px-3 py-1 font-bold`}>
                ${price.toFixed(2)}
              </div>

              <div className={`${bgColor} px-3 py-1 font-bold`}>
                {availableSeats} SEATS AVAILABLE
              </div>

              {specialEvent && (
                <div className={`${bgColor} px-3 py-1 font-bold`}>
                  SPECIAL EVENT
                </div>
              )}

              {preview && (
                <div className={`${bgColor} px-3 py-1 font-bold`}>PREVIEW</div>
              )}
            </div>

            {/* Occupancy indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-2">
              <div
                className="h-full bg-green-500"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeCard;
