"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

//SEARCHBAR FOR STUDENT BROWSE
export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function updateURL(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-row items-center gap-2 sm:gap-3 bg-[#EDE9DE] w-[95vw] sm:w-[90vw] min-h-[50px] sm:h-[7vh] p-2 sm:p-3 mx-auto my-2 sm:m-2 rounded-xl relative">
      {/* Filter Section */}
      <div className="relative">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsSortOpen(false);
          }}
          className="flex items-center justify-center text-[#C9642A]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {isFilterOpen && (
          <div className="absolute left-0 mt-4 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 text-black">
            <button
              onClick={() => {
                updateURL("type", "UP Housing");
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              UP Housing
            </button>
            <button
              onClick={() => {
                updateURL("type", "Non-UP Housing");
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Non-UP Housing
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Men's
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Women's
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              Coed
            </button>
            <button
              onClick={() => {
                updateURL("type", null);
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-500"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 group">
        {/* Search Icon (Left) */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#567375] group-focus-within:text-[#C9642A] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search for accommodations..."
          className="w-full h-[5vh] rounded-full border border-[#567375] bg-transparent py-2 pl-10 pr-4 text-sm text-[#1C2632] placeholder-[#567375]/70 focus:outline-none focus:ring-2 focus:ring-[#C9642A] focus:border-transparent transition-all"
          onChange={(e) => {
            updateURL("search", e.target.value);
            setIsSearchOpen(true);
          }}
        />
      </div>

      {/* Sort Section */}
      <div className="relative">
        <button
          onClick={() => {
            setIsSortOpen(!isSortOpen);
            setIsFilterOpen(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-sm font-semibold text-[#C9642A]"
        >
          {/* Sort Icon: Three bars with a descending arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-down-narrow-wide"
          >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h10" />
            <path d="M11 8h7" />
            <path d="M11 12h4" />
          </svg>

          <span>
            {searchParams.get("sort") === "asc"
              ? "Price: Low-High"
              : searchParams.get("sort") === "desc"
                ? "Price: High-Low"
                : "Sort By"}
          </span>
        </button>

        {isSortOpen && (
          <>
            {/* backdrop to close dropdown when clicking outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSortOpen(false)}
            ></div>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 text-[#1C2632] overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Price Ranking
              </div>

              <button
                onClick={() => {
                  updateURL("sort", "asc");
                  setIsSortOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${searchParams.get("sort") === "asc" ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
              >
                Ascending
                {searchParams.get("sort") === "asc" && (
                  <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>
                )}
              </button>

              <button
                onClick={() => {
                  updateURL("sort", "desc");
                  setIsSortOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${searchParams.get("sort") === "desc" ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
              >
                Descending
                {searchParams.get("sort") === "desc" && (
                  <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>
                )}
              </button>

              {searchParams.get("sort") && (
                <button
                  onClick={() => {
                    updateURL("sort", null);
                    setIsSortOpen(false);
                  }}
                  className="w-full text-center mt-1 pt-2 border-t border-gray-100 text-xs text-red-500 hover:text-red-700 font-medium pb-1"
                >
                  Reset Sorting
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
