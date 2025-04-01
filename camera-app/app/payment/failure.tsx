// Failure Component
const PaymentFailure = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => {
  return (
    <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 rounded-full p-2">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-red-700 mb-4">
        Payment Failed
      </h2>
      <p className="text-center text-gray-700 mb-4">
        {error ||
          "There was an issue processing your payment. Please try again."}
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
