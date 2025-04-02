"use client";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

const DASH_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL;

export function FixedPlugin() {
  return (
    <a href={DASH_URL}>
      <Button
        {...({} as any)}
        color="white"
        size="sm"
        className="!fixed bottom-4 right-4 flex gap-1 pl-2 items-center border border-blue-gray-50"
      >
        <Image
          width={128}
          height={128}
          className="w-5 h-5 rounded-full"
          alt="Material Tailwind"
          src="/logos/camera-logo.jpg"
        />{" "}
        Book Your Ticket Now
      </Button>
    </a>
  );
}
