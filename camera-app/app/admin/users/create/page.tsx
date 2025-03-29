"use client";

import DynamicForm, { FieldConfig } from "@/components/admin/dynamic-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { screenApi } from "@/lib/api";
import { StepBack, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const roomFields: FieldConfig[] = [
  {
    name: "name",
    label: "Room Name",
    type: "text",
    placeholder: "Enter room name",
    description: "The name of the screening room",
    required: true,
    min: 2,
  },
  {
    name: "seats",
    label: "Number of Seats",
    type: "number",
    placeholder: "100",
    description: "Total seating capacity",
    required: true,
    min: 1,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter room description",
    description: "Additional details about the room",
    required: false,
  },
];

const CreateScreeningRoom = () => {
  const [pictures, setPictures] = useState<FileList | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const room = {
      ...data,
      seats: parseInt(data.seats),
      imageFiles: pictures,
    };

    try {
      const response = await screenApi.create(room);
      toast({
        title: "Success",
        description: "Screening room created successfully!",
      });
      router.push("/admin/screens");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create screening room",
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Screening Room
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
              fields={roomFields}
              onSubmit={handleSubmit}
              title="Room Information"
              submitButtonText="Create Room"
            />
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Room Images
            </h2>
            <label className="block">
              <span className="sr-only">Choose room images</span>
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
              Upload images of the screening room (multiple allowed)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateScreeningRoom;
