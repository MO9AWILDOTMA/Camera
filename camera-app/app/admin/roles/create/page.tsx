"use client";

import DynamicForm, { FieldConfig } from "@/components/admin/dynamic-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { moviesApi } from "@/lib/api";
import { Genre } from "@/models/movie.model";
import { format } from "date-fns";
import { StepBack, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

// Convert Genre enum to options for the select field
const genreOptions = Object.values(Genre).map((genre) => ({
  label: genre
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()),
  value: genre,
}));

// Define fields for the Movie model
const movieFields: FieldConfig[] = [
  {
    name: "name",
    label: "Movie Title",
    type: "text",
    placeholder: "Enter movie title",
    description: "The main title of the movie",
    required: true,
    min: 2,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter movie description",
    description: "A brief summary or plot of the movie",
    required: true,
    min: 20,
    max: 2000,
  },
  {
    name: "releaseDate",
    label: "Release Date",
    type: "date",
    description: "When the movie was or will be released",
    required: true,
  },
  {
    name: "duration",
    label: "Duration (minutes)",
    type: "number",
    placeholder: "120",
    description: "Movie length in minutes",
    required: true,
    min: 1,
    max: 1000,
  },
];

const CreateMovie = () => {
  const [selectedGenres, setSelectedGenres] = React.useState<Genre[]>([]);
  const [pictures, setPictures] = React.useState<FileList | null>(null);
  const [actors, setActors] = React.useState<string[]>([]);
  const [currentActor, setCurrentActor] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const movie = {
      ...data,
      releaseDate: data.releaseDate
        ? format(data.releaseDate, "yyyy-MM-dd")
        : null,
      genres: selectedGenres,
      actors: actors,
      imageFiles: pictures,
    };

    try {
      const response = await moviesApi.create(movie);
      console.log(response.data);
      toast({
        title: "Creation successful",
        description: "Movie saved successfully!",
      });
      router.push("/admin/movies");
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.response.data.message || "Movie Creation Failed",
        variant: "destructive",
      });
    }
  };

  const handleImageDelete = (index: number) => {
    if (!pictures) return;

    const dataTransfer = new DataTransfer();
    Array.from(pictures).forEach((file, i) => {
      if (i !== index) dataTransfer.items.add(file);
    });

    setPictures(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Movie
        </h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <StepBack className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Form */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-6">
            <DynamicForm
              fields={movieFields}
              onSubmit={handleSubmit}
              title="Movie Information"
              submitButtonText="Save Movie"
            />
          </div>
        </div>

        {/* Right Column - Additional Fields */}
        <div className="lg:w-1/2 space-y-6">
          {/* Genres Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {genreOptions.map((genre) => (
                <div key={genre.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-${genre.value}`}
                    checked={selectedGenres.includes(genre.value as Genre)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGenres([
                          ...selectedGenres,
                          genre.value as Genre,
                        ]);
                      } else {
                        setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre.value)
                        );
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`genre-${genre.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {genre.label}
                  </label>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select all applicable genres
            </p>
          </div>

          {/* Actors Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Actors</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentActor}
                onChange={(e) => setCurrentActor(e.target.value)}
                placeholder="Add actor name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-300 placeholder:text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentActor.trim()) {
                    setActors([...actors, currentActor.trim()]);
                    setCurrentActor("");
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (currentActor.trim()) {
                    setActors([...actors, currentActor.trim()]);
                    setCurrentActor("");
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {actors.map((actor, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  <span>{actor}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setActors(actors.filter((_, i) => i !== index))
                    }
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Add the main actors in the movie
            </p>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Movie Images
            </h2>
            <label className="block">
              <span className="sr-only">Choose movie images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPictures(e.target.files)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </label>

            {pictures && pictures.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from(pictures).map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Upload posters and screenshots (multiple allowed)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMovie;
