"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDownUp, Filter, Search } from "lucide-react";

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
    <div className="flex flex-row items-center gap-3 bg-[#EDE9DE] w-[90vw] h-[7vh] p-3 mx-auto m-2 rounded-xl relative">
      {/* Filter Section */}
      <div className="relative">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsSortOpen(false);
          }}
          className="flex items-center justify-center text-[#8b3e15]"
          aria-label="Open filters"
          aria-expanded={isFilterOpen}
          aria-controls="student-browse-filters"
        >
          <Filter className="h-5 w-5" aria-hidden="true" />
        </button>

        {isFilterOpen && (
          <div
            id="student-browse-filters"
            className="absolute left-0 mt-4 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 text-black"
          >
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
            <button
              onClick={() => {
                updateURL("sex", "Men Only");
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Men's
            </button>
            <button
              onClick={() => {
                updateURL("sex", "Women Only");
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Women's
            </button>
            <button
              onClick={() => {
                updateURL("sex", "Co-ed");
                setIsFilterOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Coed
            </button>
            <button
              onClick={() => {
                updateURL("type", null);
                updateURL("sex", null);
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
          <Search
            className="h-4 w-4 text-[#2f4a4c] group-focus-within:text-[#8b3e15] transition-colors"
            aria-hidden="true"
          />
        </div>

        <input
          type="text"
          aria-label="Search accommodations"
          placeholder="Search for accommodations..."
          className="w-full h-[5vh] rounded-full border border-[#2f4a4c] bg-transparent py-2 pl-10 pr-4 text-sm text-[#111820] placeholder-[#2f4a4c] focus:outline-none focus:ring-2 focus:ring-[#8b3e15] focus:border-transparent transition-all"
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
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors text-sm font-semibold text-[#8b3e15]"
          aria-label="Open sort options"
          aria-expanded={isSortOpen}
          aria-controls="student-browse-sort"
        >
          {/* Sort Icon: Three bars with a descending arrow */}
          <ArrowDownUp width="20" height="20" aria-hidden="true" />

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

            <div
              id="student-browse-sort"
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 text-[#111820] overflow-hidden"
            >
              <div className="px-4 py-2 text-xs font-bold text-[#2f4a4c] uppercase tracking-widest">
                Price Ranking
              </div>

              <button
                onClick={() => {
                  updateURL("sort", "asc");
                  setIsSortOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${searchParams.get("sort") === "asc" ? "text-[#8b3e15] font-bold bg-orange-50" : ""}`}
              >
                Ascending
                {searchParams.get("sort") === "asc" && (
                  <span className="h-2 w-2 rounded-full bg-[#8b3e15]"></span>
                )}
              </button>

              <button
                onClick={() => {
                  updateURL("sort", "desc");
                  setIsSortOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${searchParams.get("sort") === "desc" ? "text-[#8b3e15] font-bold bg-orange-50" : ""}`}
              >
                Descending
                {searchParams.get("sort") === "desc" && (
                  <span className="h-2 w-2 rounded-full bg-[#8b3e15]"></span>
                )}
              </button>

              {searchParams.get("sort") && (
                <button
                  onClick={() => {
                    updateURL("sort", null);
                    setIsSortOpen(false);
                  }}
                  className="w-full text-center mt-1 pt-2 border-t border-gray-100 text-xs text-[#8b3e15] hover:text-[#111820] font-medium pb-1"
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
