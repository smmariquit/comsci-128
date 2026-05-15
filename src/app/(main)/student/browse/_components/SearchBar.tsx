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
  const isActive = (key: string, value: string) => searchParams.get(key) === value;

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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 my-4">
      <div className="flex flex-row items-center gap-3 bg-[#EDE9DE] w-full py-3 px-4 rounded-xl relative shadow-sm">
        
        {/* Filter Section */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSortOpen(false);
            }}
            className="flex items-center justify-center text-[#C9642A] hover:opacity-80 transition-opacity"
          >
            <Filter className="h-5 w-5" />
          </button>

          {isFilterOpen && (
            <>
              
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
              
              <div className="absolute left-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 text-[#1C2632] overflow-hidden">
                
                {/* Header 1: Type */}
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Housing Type
                </div>
                <button
                  onClick={() => { updateURL("type", "UP Housing"); setIsFilterOpen(false); }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isActive("type", "UP Housing") ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
                >
                  UP Housing
                  {isActive("type", "UP Housing") && <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>}
                </button>
                <button
                  onClick={() => { updateURL("type", "Non-UP Housing"); setIsFilterOpen(false); }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isActive("type", "Non-UP Housing") ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
                >
                  Non-UP Housing
                  {isActive("type", "Non-UP Housing") && <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>}
                </button>

                {/* Header 2: Sex */}
                <div className="px-4 py-2 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-3">
                  Target Demographic
                </div>
                <button
                  onClick={() => { updateURL("sex", "Men Only"); setIsFilterOpen(false); }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isActive("sex", "Men Only") ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
                >
                  Men Only
                  {isActive("sex", "Men Only") && <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>}
                </button>
                <button
                  onClick={() => { updateURL("sex", "Women Only"); setIsFilterOpen(false); }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isActive("sex", "Women Only") ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
                >
                  Women Only
                  {isActive("sex", "Women Only") && <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>}
                </button>
                <button
                  onClick={() => { updateURL("sex", "Co-ed"); setIsFilterOpen(false); }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isActive("sex", "Co-ed") ? "text-[#C9642A] font-bold bg-orange-50" : ""}`}
                >
                  Co-ed
                  {isActive("sex", "Co-ed") && <span className="h-2 w-2 rounded-full bg-[#C9642A]"></span>}
                </button>

                {/* Footer: Clear */}
                {(searchParams.get("type") || searchParams.get("sex")) && (
                  <button
                    onClick={() => {
                      // Create a fresh instance using the native window URL if available,
                      // or clean it up sequentially using a unified string builder
                      const params = new URLSearchParams(window.location.search);
                      params.delete("type");
                      params.delete("sex");
                      
                      // Update the URL in one single, clean push
                      replace(`${pathname}?${params.toString()}`);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-center mt-1 pt-2 border-t border-gray-100 text-xs text-red-500 hover:text-red-700 font-medium pb-1"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </>
          )}
        </div>

    

        {/* Search */}
        <div className="relative flex-1 group flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#567375] group-focus-within:text-[#C9642A] transition-colors" />
          </div>

          {/* Replaced fixed h-[5vh] with standard h-10 padding bounds to maintain centering alignment */}
          <input
            type="text"
            placeholder="Search for accommodations..."
            className="w-full h-10 rounded-full border border-[#567375] bg-transparent pl-10 pr-4 text-sm text-[#1C2632] placeholder-[#567375]/70 focus:outline-none focus:border-transparent transition-all"
            onChange={(e) => {
              updateURL("search", e.target.value);
              setIsSearchOpen(true);
            }}
          />
        </div>

        {/* Sort Section */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsFilterOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors text-sm font-semibold text-[#C9642A]"
          >
            <ArrowDownUp width="18" height="18" />
            <span className="hidden sm:inline">
              {searchParams.get("sort") === "asc"
                ? "Price: Low-High"
                : searchParams.get("sort") === "desc"
                  ? "Price: High-Low"
                  : "Sort By"}
            </span>
          </button>

          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSortOpen(false)}
              ></div>

              <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 text-[#1C2632] overflow-hidden">
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
    </div>
  );
}
