import React, { useState, useRef, useEffect } from "react";

interface SearchProps {
  selectedGenre: string; // Controlled selected genre
  initialGenre?: string;
  genres?: string[];
  placeholder?: string;
  onSearch: (selectedGenre: string, searchTerm: string) => void; // Callback for search
}

const Search: React.FC<SearchProps> = ({
  selectedGenre,
  initialGenre = "",
  genres = [
    "ACTION",
    "ADVENTURE",
    "ANIMATION",
    "BIOGRAPHY",
    "COMEDY",
    "CRIME",
    "DOCUMENTARY",
    "DRAMA",
    "FAMILY",
    "FANTASY",
    "HISTORY",
    "HORROR",
    "MUSICAL",
    "MYSTERY",
    "ROMANCE",
    "SCIENCE_FICTION",
    "SPORTS",
    "THRILLER",
    "WAR",
    "WESTERN",
  ],
  placeholder = "Search movies...",
  onSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(""); // Local state for input value
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleGenreSelect = (genre: string) => {
    onSearch(genre, localSearchTerm); // Notify parent of genre change
    setIsOpen(false);
  };

  const handleSearch = () => {
    onSearch(selectedGenre, localSearchTerm); // Notify parent of search
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-sm min-w-[300px]">
      <div className="relative mt-2">
        <div
          className="absolute top-1 left-1 flex items-center"
          ref={dropdownRef}
        >
          <button
            className="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600"
            onClick={toggleDropdown}
          >
            <span className="text-ellipsis overflow-hidden max-w-[100px]">
              {selectedGenre || "Genre"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          <div className="h-6 border-l border-slate-200 ml-1"></div>

          {isOpen && (
            <div className="min-w-[200px] max-h-[300px] overflow-y-auto overflow-x-hidden absolute left-0 mt-10 bg-white border border-slate-200 rounded-md shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer flex items-center"
                  onClick={() => handleGenreSelect("")}
                >
                  <span className={selectedGenre === "" ? "font-medium" : ""}>
                    All Genres
                  </span>
                </li>
                {genres.map((genre) => (
                  <li
                    key={genre}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer flex items-center"
                    onClick={() => handleGenreSelect(genre)}
                  >
                    <span
                      className={selectedGenre === genre ? "font-medium" : ""}
                    >
                      {genre.replace("_", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          type="text"
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-12 pl-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder={placeholder}
          value={localSearchTerm} // Controlled by local state
          onChange={(e) => setLocalSearchTerm(e.target.value)} // Update local state
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(); // Trigger search on Enter
            }
          }}
        />

        <button
          className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-black transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={handleSearch} // Trigger search on button click
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Search;
