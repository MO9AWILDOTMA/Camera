"use client";

import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/table";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Film, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Payment from "@/models/payment.model";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GlobalStatus } from "@/models/enums/global.status.enum";
import { paymentsApi } from "@/lib/api";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "showtime",
    label: "Movie",
    render: (item: Payment) => item.reservation.showtime.movie.name,
  },
  {
    key: "dateTime",
    label: "Date & Time",
    render: (item: Payment) =>
      new Date(item.reservation.showtime.dateTime).toLocaleString(),
  },
  {
    key: "seat",
    label: "Seat",
    render: (item: Payment) => item.reservation.seat, // Fix: Access seat from reservation
  },
  {
    key: "version",
    label: "Version",
    render: (item: Payment) => item.reservation.showtime.showVersion, // Fix: Access showVersion from reservation.showtime
  },
  {
    key: "status",
    label: "Status",
    render: (item: Payment) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          item.status === GlobalStatus.CONFIRMED
            ? "bg-green-100 text-green-800"
            : item.status === GlobalStatus.IN_PROGRESS
              ? "bg-blue-100 text-blue-800"
              : item.status === GlobalStatus.CANCELLED
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
        }`}
      >
        {item.status}
      </span>
    ),
  },
];

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentsApi.getAll(page, size);
        const data = response.data;

        setPayments(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [page, size]);

  const handleDelete = async (item: Payment) => {
    try {
      await paymentsApi.delete(item.id);
      toast({
        title: "Success",
        description: "Payment deleted successfully!",
      });
      // Refresh the list
      setPage(1);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete payment",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payments Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          data={payments}
          onDelete={handleDelete}
          columns={columns}
          showActions={true}
        />

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
