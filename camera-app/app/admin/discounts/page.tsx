"use client";

import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/table";
import { Column } from "@/types/table-types";
import { discountsApi } from "@/lib/api";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Discount from "@/models/discount.model";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "percentage", label: "Percentage %" },
];
const Discounts = () => {
  const [discounts, setDiscounts] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await discountsApi.getAll(page, size);
        const data = response.data;

        setDiscounts(data.content || []);
        // setPage(data)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [loading]);

  const showDiscount = () => {};

  const handleDelete = async (item: Discount) => {
    setLoading(true);
    try {
      await discountsApi.delete(item.id);
      toast({
        title: "Deleting successful",
        description: "Discount deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Deleting failed",
        description: error.response.data.message || "Discount Deletings Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (discount: Discount) => {
    router.push(`/admin/discounts/update/${discount.id}`);
  };
  if (loading) return <Loading />;
  return (
    <div>
      <div className="flex justify-between items-center lg:flex-nowrap flex-wrap md:flex-nowrap">
        <h2 className="px-10 mb-4 font-bold text-2xl">Discounts Managment</h2>
        <div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("discounts/create")}
          >
            <Film className="mr-2 h-4 w-4" />
            Create New Discount
          </Button>
        </div>
      </div>
      <Table
        data={discounts}
        onDelete={handleDelete}
        onShow={showDiscount}
        onEdit={handleEdit}
        columns={columns}
      />
    </div>
  );
};

export default Discounts;
