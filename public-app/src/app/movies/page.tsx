import React from "react";
import MoviesList from "./movie-list";
import VideoHero from "@/components/video-hero";

const Movies = () => {
  return (
    <>
      <VideoHero
        videoSrc="/video/video-1.mp4"
        title="Movies"
        subtitle="Explore our curated selection of films, from timeless classics to the latest blockbusters. Whether you're a fan of drama, action, or indie cinema, we have something for everyone. Discover the magic of storytelling on the big screen."
      />
      <MoviesList />
    </>
  );
};

export default Movies;
