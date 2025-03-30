import VideoHero from "@/components/video-hero";
import React from "react";
import ScreeningRoomsList from "./room-list";
import { ErrorBoundary } from "@/components/error-boundary";

const ScreeningRooms = () => {
  return (
    <>
      <VideoHero
        title="Screening Rooms"
        videoSrc="/video/video-2.mp4"
        subtitle="Experience cinema in style. Our state-of-the-art screening rooms combine vintage charm with modern comfort, offering the perfect setting for an unforgettable movie experience."
      />
      <ErrorBoundary>
        <ScreeningRoomsList />
      </ErrorBoundary>
    </>
  );
};

export default ScreeningRooms;
