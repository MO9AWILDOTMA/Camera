"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold text-red-600">Something went wrong:</h2>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
