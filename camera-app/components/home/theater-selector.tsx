"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Theater = {
  id: string;
  name: string;
  location: string;
};

export function TheaterSelector() {
  const [open, setOpen] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use: const response = await theatersApi.getAll()
        const mockTheaters: Theater[] = [
          {
            id: "1",
            name: "Camera Downtown",
            location: "123 Main St, Downtown",
          },
          {
            id: "2",
            name: "Camera Westside",
            location: "456 West Ave, Westside",
          },
          {
            id: "3",
            name: "Camera Eastside",
            location: "789 East Blvd, Eastside",
          },
          {
            id: "4",
            name: "Camera Northside",
            location: "101 North Rd, Northside",
          },
        ];
        setTheaters(mockTheaters);

        // Set default theater
        const savedTheaterId = localStorage.getItem("selectedTheaterId");
        if (savedTheaterId) {
          const saved = mockTheaters.find((t) => t.id === savedTheaterId);
          if (saved) setSelectedTheater(saved);
        } else {
          setSelectedTheater(mockTheaters[0]);
        }
      } catch (error) {
        console.error("Failed to fetch theaters:", error);
      }
    };

    fetchTheaters();
  }, []);

  const handleSelectTheater = (theater: Theater) => {
    setSelectedTheater(theater);
    localStorage.setItem("selectedTheaterId", theater.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {selectedTheater?.name || "Select Theater"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search theaters..." />
          <CommandList>
            <CommandEmpty>No theater found.</CommandEmpty>
            <CommandGroup>
              {theaters.map((theater) => (
                <CommandItem
                  key={theater.id}
                  value={theater.name}
                  onSelect={() => handleSelectTheater(theater)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTheater?.id === theater.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{theater.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {theater.location}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
