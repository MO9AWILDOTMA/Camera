"use client";

import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  screeningRoom: {
    id: number;
    name: string;
    slug: string;
    seats: number;
    picturePaths: string[];
    specs?: {
      screenSize: string;
      projection: string;
      sound?: string;
      color?: string;
    };
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ScreeningRoomCard = ({ screeningRoom }: CardProps) => {
  const router = useRouter();
  const {
    name,
    slug,
    seats,
    picturePaths,
    specs = {
      screenSize: "7,15M X 3M",
      projection: "4K",
      color: "COLOR LIGHTNING",
    },
  } = screeningRoom;

  const pictureSrc =
    BASE_URL + (picturePaths.length > 0 ? picturePaths[0] : "");

  const colorTheme = "bg-red-800 text-white";

  return (
    <div className="w-full mb-6 transition-transform duration-300 ease-in-out hover:scale-90">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg border border-gray-200">
        {/* Left side vertical label */}
        <div
          className={`${colorTheme} flex items-center justify-center p-4 w-full md:w-24`}
        >
          <Tooltip content={name}>
            <h2 className="text-4xl font-bold tracking-tighter transform md:-rotate-90 whitespace-nowrap">
              {name.substring(0, 10)}
              {name.length > 10 ? "..." : ""}
            </h2>
          </Tooltip>
        </div>

        {/* Main content area */}
        <div className="flex-1 relative bg-black">
          <div className="relative h-52 md:h-64">
            <Image
              src={pictureSrc}
              alt={`Salle ${name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Technical specs overlay */}
            <div className="absolute right-0 top-0 m-4 flex flex-col gap-1">
              <div className={`${colorTheme} px-3 py-1 font-bold`}>
                {seats} SEATS
              </div>

              {specs?.screenSize && (
                <div className={`${colorTheme} px-3 py-1 font-bold`}>
                  SCREEN : {specs.screenSize}
                </div>
              )}

              {specs?.projection && (
                <div className={`${colorTheme} px-3 py-1 font-bold`}>
                  PROJECTION {specs.projection}
                </div>
              )}

              {specs?.sound && (
                <div className={`${colorTheme} px-3 py-1 font-bold`}>
                  SOUND {specs.sound}
                </div>
              )}

              {specs?.color && (
                <div className={`${colorTheme} px-3 py-1 font-bold`}>
                  {specs.color}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningRoomCard;
