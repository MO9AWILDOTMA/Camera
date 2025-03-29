"use client";

import React from "react";

// Types for component props
interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

const Loading: React.FC<SpinnerProps> = ({
  size = "medium",
  color = "#e50914", // Cinema red color
  text = "Loading",
}) => {
  // Determine the spinner size
  const sizeMap = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  // Determine text size
  const textSizeMap = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      {/* Spinner */}
      <div className={`${sizeMap[size]} relative`}>
        <div
          className="absolute w-full h-full border-4 rounded-full animate-spin"
          style={{
            borderColor: `${color} transparent transparent transparent`,
            animationDuration: "1s",
          }}
        ></div>
      </div>

      {/* Optional loading text */}
      {text && (
        <div className={`mt-2 ${textSizeMap[size]} text-gray-700`}>{text}</div>
      )}
    </div>
  );
};

export default Loading;
