"use client";

import Loading from "@/components/loading";
import { Pagination } from "@/components/pagination";
import React, { useMemo } from "react";
import ScreeningRoom from "@/models/ScreeningRoom";
import { fetchScreeningRooms } from "@/apis/fetchScreens";
import ScreeningRoomCard from "@/components/screen-card";
import { useQuery } from "@tanstack/react-query";

const ScreeningRoomsList = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const size = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ["screeningRooms", currentPage, size],
    queryFn: async () => {
      const resp = await fetchScreeningRooms(size, currentPage);
      return {
        rooms: JSON.parse(JSON.stringify(resp.data.content || [])),
        totalPages: resp.data.totalPages || 1,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Memoize the room cards to prevent unnecessary re-renders
  const roomCards = useMemo(() => {
    if (!data?.rooms) return null;
    return data.rooms.map((screeningroom: ScreeningRoom) => (
      <ScreeningRoomCard screeningRoom={screeningroom} key={screeningroom.id} />
    ));
  }, [data?.rooms]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">
          Failed to load screening rooms. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-10 py-12">
      <div className="flex flex-wrap gap-6 justify-center py-10">
        {roomCards}
        {data?.rooms.length === 0 && (
          <div className="text-center w-full">No screening rooms available</div>
        )}
      </div>

      {data?.rooms.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            active={currentPage}
            totalPages={data!.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ScreeningRoomsList;
