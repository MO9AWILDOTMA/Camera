import VideoHero from "@/components/video-hero";
import React from "react";
import ShowtimeList from "./showtime-list";

const Showtimes = () => {
  return (
    <>
      <VideoHero
        title="Showtimes"
        videoSrc="/video/video-3.mp4"
        subtitle="Never miss a show! Check out our up-to-date schedule for all screenings. Plan your visit and book tickets for your favorite movies at the most convenient times."
      />
      <ShowtimeList />
    </>
  );
};

export default Showtimes;
