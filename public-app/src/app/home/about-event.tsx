"use client";

import { Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";
import { useEffect, useState } from "react";
import { fetchShowtimes } from "@/apis/fetchShowtimes";
import { Movie, MovieStatus } from "@/models/Movie";
import Showtime from "@/models/Showtime";

const EVENT_INFO: Movie[] = [
  {
    name: "Cutting-Edge Insights!",
    description:
      "Gain deep insights into the latest AI trends, developments, and applications that are reshaping industries worldwide. ",
    status: MovieStatus.ADVANCE_BOOKING,
    id: 0,
    slug: "",
    picturePaths: [],
  },
  {
    name: "Practical Knowledge!",
    description:
      "Attend workshops and hands-on sessions to acquire practical skills that you can apply immediately.",
    status: MovieStatus.COMING_SOON,
    id: 0,
    slug: "",
    picturePaths: [],
  },
];

export function AboutEvent() {
  const [movies, setMovies] = useState<Movie[]>(EVENT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getShowtimes = async () => {
      try {
        const resp = await fetchShowtimes(1, 6);
        let movieArray: Movie[] = [];
        resp.data.content.forEach((showtime: Showtime) => {
          const exists = movieArray.some(
            (movie) => movie.id === showtime.movie.id
          );

          if (!exists) {
            movieArray.push(showtime.movie);
          }
        });
        setMovies(movieArray.length > 0 ? movieArray : EVENT_INFO);
      } catch (error) {
        console.error("Failed to fetch showtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    getShowtimes();
  }, []);
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-10">
      <Typography
        {...({} as any)}
        variant="h6"
        className="text-center mb-2"
        color="orange"
      >
        About the movie theater
      </Typography>
      <Typography
        {...({} as any)}
        variant="h3"
        className="text-center"
        color="blue-gray"
      >
        Why It Matters?
      </Typography>
      <Typography
        {...({} as any)}
        variant="lead"
        className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500"
      >
        Cinema Caméra’s reopening is a testament to the power of community and
        the enduring love for cinema. It has become a symbol of cultural
        preservation and a beacon for Morocco’s cinematic revival. For
        cinephiles, it’s not just a theater—it’s a piece of living history. 🎥
      </Typography>
      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.map((movie, index) => {
          // For odd number of movies, the last one should span full width
          const isLastItemInOddCollection =
            index === movies.length - 1 && movies.length % 2 === 1;

          return (
            <div
              key={index}
              className={isLastItemInOddCollection ? "md:col-span-2" : ""}
            >
              <AboutCard {...movie} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AboutEvent;
