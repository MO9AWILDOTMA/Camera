"use client";

import { fetchShowtimes } from "@/apis/fetchShowtimes";
import Alert from "@/components/alert";
import Loading from "@/components/loading";
import { Pagination } from "@/components/pagination";
import ShowtimeCard from "@/components/showtime-card";
import Showtime from "@/models/Showtime";
import React, { useEffect, useState } from "react";

const ShowtimesList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 6;

  // Fetch showtimes based on current state
  const getShowtimes = async () => {
    try {
      setLoading(true);
      const resp = await fetchShowtimes(currentPage, 1);
      setShowtimes(resp.data.content || []);
      setTotalPages(resp.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch showtimes when page, search term, or genre changes
  useEffect(() => {
    getShowtimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Alert timeout
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-10 py-12">
      <Alert
        color="warning"
        title="Warning!"
        message="Make sure to enter the search term"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        autoClose={true}
      />
      <div className="flex flex-wrap gap-6 justify-center py-10">
        {showtimes.map((showtime: Showtime, index: number) => (
          <ShowtimeCard showtime={showtime} key={index} />
        ))}
        {showtimes.length == 0 && <div>List is empty</div>}
      </div>

      {showtimes.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            active={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ShowtimesList;
