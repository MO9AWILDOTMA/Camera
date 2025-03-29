"use client";

import React, { useEffect, useState } from "react";
import ShowtimesTable from "../../../components/admin/table";
import { Column } from "@/types/table-types";
import { showtimesApi } from "@/lib/api";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Showtime from "@/models/showtime.model";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns = [
  { key: "id", label: "ID" },
  {
    key: "movie",
    label: "Movie Name",
    render: (item: any) => item.movie?.name,
  },
  { key: "price", label: "Price" },
  { key: "showVersion", label: "Show Language" },
  { key: "reservedSeats", label: "Reserved Seats" },
  { key: "totalSeats", label: "Total Seats" },
  {
    key: "preview",
    label: "Is Preview",
    render: (item: any) => item.preview.toString(),
  },
  {
    key: "specialEvent",
    label: "Is Special Event",
    render: (item: any) => item.specialEvent.toString(),
  },
];
const Showtimes = () => {
  const [showtimes, setShowtimes] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await showtimesApi.getAll(page, size);
        const data = response.data;

        setShowtimes(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [loading]);

  const showShowtime = () => {};

  const handleDelete = async (item: Showtime) => {
    setLoading(true);
    try {
      await showtimesApi.delete(item.id);
      toast({
        title: "Deleting successful",
        description: "Showtime deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Deleting failed",
        description: error.response.data.message || "Showtime Deletings Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (showtime: Showtime) => {
    router.push(`/admin/showtimes/update/${showtime.slug}`);
  };
  if (loading) return <Loading />;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center lg:flex-nowrap flex-wrap md:flex-nowrap">
        <h2 className="px-10 mb-4 font-bold text-2xl">Showtimes Managment</h2>
        <div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("showtimes/create")}
          >
            <Film className="mr-2 h-4 w-4" />
            Create New Showtime
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ShowtimesTable
          data={showtimes}
          onDelete={handleDelete}
          onShow={showShowtime}
          onEdit={handleEdit}
          columns={columns}
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

export default Showtimes;
