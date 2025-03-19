import React, { ReactNode, useEffect } from "react";

type AlertColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "danger"
  | "warning";

interface AlertProps {
  color?: AlertColor;
  title?: ReactNode;
  message?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  color = "default",
  title,
  message,
  isOpen = false,
  onClose,
  autoClose = false,
  autoCloseTime = 5000,
  className = "",
}) => {
  // Handle auto-close functionality
  useEffect(() => {
    if (autoClose && isOpen && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, isOpen, onClose]);

  const colorClasses: Record<AlertColor, string> = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-gray-200 text-gray-800 border-gray-300",
    info: "bg-cyan-100 text-cyan-800 border-cyan-200",
    success: "bg-green-100 text-green-800 border-green-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-md px-4">
      <div
        className={`border rounded shadow-lg px-4 py-3 ${colorClasses[color]} ${className}`}
        role="alert"
      >
        <div className="flex justify-between items-start">
          <div>
            {title && <strong className="mr-1">{title}</strong>}
            {message && <span>{message}</span>}
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
