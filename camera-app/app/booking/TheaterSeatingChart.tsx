import ScreeningRoom, { Seat } from "@/models/screening-room.model";
import React from "react";

const TheaterSeatingChart = ({
  screeningRoom,
  seats,
  handleSeatClick,
  selectedSeats,
}: {
  screeningRoom?: ScreeningRoom;
  seats: Seat[][];
  handleSeatClick: (seat: Seat) => void;
  selectedSeats: Seat[];
}) => {
  // Calculate theater dimensions based on seat arrangement
  const maxSeatsInRow = Math.max(...seats.map((row) => row.length), 0);
  const totalRows = seats.length;

  // Check if we should show the screen curved based on the number of seats
  const showCurvedScreen = maxSeatsInRow > 10;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 w-full overflow-x-auto">
        {/* Screen */}
        <div
          className={`mb-8 w-full ${showCurvedScreen ? "rounded-t-full" : "rounded-lg"} bg-muted p-3 text-center text-sm font-medium border-b-4 border-gray-400`}
        >
          ÉCRAN
        </div>

        {/* Theater title */}
        <div className="mb-4 text-center text-lg font-medium">
          {screeningRoom?.name}
        </div>

        {/* Seating area */}
        <div className="mb-8 flex justify-center">
          <div className="space-y-2">
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2">
                <div className="w-6 text-center text-sm font-medium">
                  {row[0]?.row}
                </div>
                <div className="flex gap-1">
                  {row.map((seat) => (
                    <button
                      key={seat.id}
                      className={`h-8 w-8 rounded-t-lg text-xs font-medium transition-colors ${
                        seat.status === "UNAVAILABLE"
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : seat.status === "SELECTED"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted border border-gray-300"
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === "UNAVAILABLE"}
                      title={`Row ${seat.row}, Seat ${seat.number}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
                <div className="w-6 text-center text-sm font-medium">
                  {row[0]?.row}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-background border border-gray-300"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-muted"></div>
            <span className="text-xs">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-sm bg-primary"></div>
            <span className="text-xs">Selected</span>
          </div>
        </div>
      </div>

      {/* Selected seats summary */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium mb-2">
          Selected Seats: {selectedSeats.length}
        </h3>
        {selectedSeats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="bg-muted px-2 py-1 rounded-md text-xs"
              >
                Row {seat.row}, Seat {seat.number}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheaterSeatingChart;
