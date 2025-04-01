import Reservation from "@/models/reservation.model";

// Success Component
const PaymentSuccess = ({ reservation }: { reservation: Reservation }) => {
  const { movie, dateTime, screeningRoom } = reservation.showtime;
  const formattedDate = new Date(dateTime).toLocaleString();

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-green-100 rounded-full p-2">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
        Payment Successful!
      </h2>
      <div className="bg-white p-4 rounded-md mb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{movie.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Date & Time:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Screen:</span> {screeningRoom.name}
          </p>
          <p>
            <span className="font-medium">Seat:</span> {reservation.seat}
          </p>
          <p>
            <span className="font-medium">Ticket Type:</span>{" "}
            {reservation.ticket.type}
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          A confirmation email has been sent to your email address.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          View My Tickets
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
