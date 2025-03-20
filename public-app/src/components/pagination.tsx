import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  active: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  active,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getItemProps = (index: number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => onPageChange(index),
      className: "rounded-full",
    }) as any;

  const next = () => {
    if (active === totalPages) return;
    onPageChange(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    onPageChange(active - 1);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        {...({} as any)}
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <IconButton key={pageNum} {...getItemProps(pageNum)}>
            {pageNum}
          </IconButton>
        ))}
      </div>
      <Button
        {...({} as any)}
        variant="text"
        className="flex items-center gap-2 rounded-full"
        onClick={next}
        disabled={active === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}
