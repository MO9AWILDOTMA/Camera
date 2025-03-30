"use client";

import DynamicForm, { FieldConfig } from "@/components/admin/dynamic-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { discountsApi, moviesApi, screenApi, showtimesApi } from "@/lib/api";
import { format } from "date-fns";
import { StepBack, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const showtimeFields: FieldConfig[] = [
  {
    name: "dateTime",
    label: "Date & Time",
    type: "datetime",
    placeholder: "Select date and time",
    description: "When the showtime will occur",
    required: true,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "10.00",
    description: "Ticket price in USD",
    required: true,
    min: 0,
  },
  {
    name: "totalSeats",
    label: "Total Seats",
    type: "number",
    placeholder: "100",
    description: "Total available seats",
    required: true,
    min: 1,
  },
  {
    name: "showVersion",
    label: "Version",
    type: "select",
    options: [
      { value: "VO", label: "Original Version (VO)" },
      { value: "VOST_FR", label: "Subtitled in French (VOST_FR)" },
      { value: "VOST_EN", label: "Subtitled in English (VOST_EN)" },
    ],
    description: "Language version of the screening",
    required: true,
  },
  {
    name: "isPreview",
    label: "Preview Screening",
    type: "checkbox",
    description: "Check if this is a preview/premiere screening",
  },
  {
    name: "isSpecialEvent",
    label: "Special Event",
    type: "checkbox",
    description: "Check if this is a special event screening",
  },
];

const CreateShowtime = () => {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
  const [availableMovies, setAvailableMovies] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  // Load available data when component mounts
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesResponse, roomsResponse, discountsResponse] =
          await Promise.all([
            moviesApi.getAll(1, 50),
            screenApi.getAll(1, 50),
            discountsApi.getAll(1, 50),
          ]);
        setAvailableMovies(moviesResponse.data.content);
        setAvailableRooms(roomsResponse.data.content);
        setAvailableDiscounts(discountsResponse.data.content);
      } catch (error) {
        console.error("Failed to load data", error);
        toast({
          title: "Error",
          description: "Failed to load required data",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, []);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    addShowtime(data);
  };

  const addShowtime = (formData: any) => {
    if (!selectedMovie || !selectedRoom) {
      toast({
        title: "Error",
        description: "Please select a movie and screening room",
        variant: "destructive",
      });
      return;
    }

    const newShowtime = {
      ...formData,
      dateTime: formData.dateTime
        ? format(new Date(formData.dateTime), "yyyy-MM-dd'T'HH:mm:ss")
        : null,
      movieId: selectedMovie,
      screeningRoomId: selectedRoom,
      discountIds: selectedDiscounts,
      price: parseFloat(formData.price || 0),
      totalSeats: parseInt(formData.totalSeats || 0),
      showVersion: formData.showVersion || "VO",
      isPreview: formData.isPreview || false,
      isSpecialEvent: formData.isSpecialEvent || false,
    };

    setShowtimes([...showtimes, newShowtime]);
    toast({
      title: "Success",
      description: "Showtime added to batch",
    });
  };

  const submitAllShowtimes = async () => {
    if (showtimes.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one showtime",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await showtimesApi.create(showtimes);
      toast({
        title: "Success",
        description: `${showtimes.length} showtimes created successfully!`,
      });
      router.push("/admin/showtimes");
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description:
          error.response?.data?.message || "Showtime creation failed",
        variant: "destructive",
      });
    }
  };

  const removeShowtime = (index: number) => {
    setShowtimes(showtimes.filter((_, i) => i !== index));
  };

  const toggleDiscount = (discountId: number) => {
    setSelectedDiscounts((prev) =>
      prev.includes(discountId)
        ? prev.filter((id) => id !== discountId)
        : [...prev, discountId]
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create Showtimes
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <DynamicForm
              fields={showtimeFields}
              onSubmit={handleFormSubmit}
              title="Showtime Information"
              submitButtonText="Add Showtime"
            />
          </div>

          {/* Selected Showtimes Preview */}
          {showtimes.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Showtimes to Create ({showtimes.length})
              </h2>
              <div className="space-y-3">
                {showtimes.map((st, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {availableMovies.find((m) => m.id === st.movieId)
                          ?.name || "Unknown Movie"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {st.dateTime} |{" "}
                        {availableRooms.find((r) => r.id === st.screeningRoomId)
                          ?.name || "Unknown Room"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeShowtime(index)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={submitAllShowtimes} className="w-full mt-4">
                Create All Showtimes
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <p className="text-gray-500 text-center">
                No showtimes added yet. Fill the form and click "Add Showtime".
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Selections */}
        <div className="lg:w-1/2 space-y-6">
          {/* Movie Selection Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Movie
            </h2>
            <div className="space-y-4">
              {availableMovies.length > 0 ? (
                availableMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMovie === movie.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setSelectedMovie(movie.id)}
                  >
                    <h3 className="font-medium">{movie.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {movie.description}
                    </p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Duration: {movie.duration} mins</span>
                      <span>Release: {movie.releaseDate}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No movies available</p>
              )}
            </div>
          </div>

          {/* Screening Room Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Select Screening Room
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoom === room.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <h3 className="font-medium">{room.name}</h3>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Capacity: {room.capacity}</span>
                      <span>Type: {room.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No screening rooms available</p>
              )}
            </div>
          </div>

          {/* Discounts Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Available Discounts
            </h2>
            <div className="space-y-3">
              {availableDiscounts.length > 0 ? (
                availableDiscounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="flex items-center p-3 border rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`discount-${discount.id}`}
                      checked={selectedDiscounts.includes(discount.id)}
                      onChange={() => toggleDiscount(discount.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`discount-${discount.id}`}
                      className="ml-3 flex-1"
                    >
                      <span className="block font-medium">{discount.name}</span>
                      <span className="block text-sm text-gray-600">
                        {discount.description} - {discount.percentage}% off
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No discounts available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShowtime;
