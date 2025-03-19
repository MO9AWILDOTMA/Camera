"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  imageSrc: string;
  slug: string;
  title: string;
  description: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const MovieCard = ({ imageSrc, slug, title, description }: CardProps) => {
  const router = useRouter();

  function handleNavigation() {
    router.push("/movies/" + slug);
  }

  const picture = BASE_URL + imageSrc;

  return (
    <div className="max-w-sm bg-white border border-gray-400 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="h-[200px] bg-gray-800 flex">
        <Image
          className="rounded-t-lg"
          src={picture}
          alt="Blog post thumbnail"
          width={400}
          height={200}
          onClick={handleNavigation}
        />
      </div>
      <div className="p-5">
        <h5
          onClick={handleNavigation}
          className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {title}
        </h5>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <span
          onClick={handleNavigation}
          className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
