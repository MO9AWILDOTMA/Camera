"use client";

import React, { useEffect, useState } from "react";
import GenericTable from "@/components/admin/table";
import { Column } from "@/types/table-types";
import { screenApi } from "@/lib/api";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ScreeningRoom from "@/models/screening-room.model";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns: Column<ScreeningRoom>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "seats",
    label: "Seats",
    render: (item: ScreeningRoom) => item.seats.length,
  },
  {
    key: "picturePaths",
    label: "Images",
    render: (item: ScreeningRoom) => (
      <span className="text-sm text-gray-600">
        {item.picturePaths?.length || 0} images
      </span>
    ),
  },
];

const ScreeningRooms = () => {
  const [rooms, setRooms] = useState<ScreeningRoom[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await screenApi.getAll(page, size);
        const data = response.data;

        setRooms(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load screening rooms",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [page, size, deleting]);

  const showRoom = (room: ScreeningRoom) => {
    router.push(`/admin/screening-rooms/${room.slug}`);
  };

  const handleDelete = async (room: ScreeningRoom) => {
    setLoading(true);
    setDeleting(true);
    try {
      await screenApi.delete(room.id);
      toast({
        title: "Success",
        description: "Screening room deleted successfully!",
      });
      // Refresh the list
      setPage(1);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete screening room",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleting(false);
    }
  };

  const handleEdit = (room: ScreeningRoom) => {
    router.push(`/admin/screens/update/${room.slug}`);
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
        <h2 className="text-2xl font-bold">Screening Rooms Management</h2>
        <Button onClick={() => router.push("/admin/screens/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Room
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <GenericTable
          data={rooms}
          onDelete={handleDelete}
          onShow={showRoom}
          onEdit={handleEdit}
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

export default ScreeningRooms;
