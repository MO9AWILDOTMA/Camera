"use client";

import DynamicForm, { FieldConfig } from "@/components/admin/dynamic-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { discountsApi } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { StepBack, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { discountFields } from "../../create/page";

const UpdateDiscount = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = React.useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await discountsApi.getById(id as unknown as number);
        setInitialData(response.data);
      } catch (error: any) {
        toast({
          title: "Error loading discount",
          description:
            error.response?.data?.message || "Failed to load discount data",
          variant: "destructive",
        });
        router.push("/admin/discounts");
      }
    };

    if (id) {
      fetchDiscount();
    }
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await discountsApi.update(initialData.id, data);
      console.log(response.data);
      toast({
        title: "Update successful",
        description: "Discount updated successfully!",
      });
      router.push("/admin/discounts");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Discount update failed",
        variant: "destructive",
      });
    }
  };

  if (!initialData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading discount data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Update Discount
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
            submitButtonText="Update Discount"
            defaultValues={initialData}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateDiscount;
