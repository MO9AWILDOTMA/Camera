"use client";

import DynamicForm, { FieldConfig } from "@/components/admin/dynamic-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { discountsApi } from "@/lib/api";
import { Genre } from "@/models/discount.model";
import { format } from "date-fns";
import { StepBack, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

// Define fields for the Discount model
export const discountFields: FieldConfig[] = [
  {
    name: "name",
    label: "Discount Title",
    type: "text",
    placeholder: "Enter discount title",
    description: "The main title of the discount",
    required: true,
    min: 2,
  },
  {
    name: "percentage",
    label: "Percentage (%)",
    type: "number",
    placeholder: "0.25",
    description: "Discount Percentage",
    required: true,
    min: 0,
    max: 1,
  },
];

const CreateDiscount = () => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await discountsApi.create(data);
      console.log(response.data);
      toast({
        title: "Creation successful",
        description: "Discount saved successfully!",
      });
      router.push("/admin/discounts");
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.response.data.message || "Discount Creation Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Discount
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
        <div className="bg-white rounded-lg shadow p-6">
          <DynamicForm
            fields={discountFields}
            onSubmit={handleSubmit}
            title="Discount Information"
            submitButtonText="Save Discount"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDiscount;
