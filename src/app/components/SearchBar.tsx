"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

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
                    onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                    className="flex items-center justify-center text-[#C9642A]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </button>

                {isFilterOpen && (
                    <div className="absolute left-0 mt-4 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 text-black">
                        <button onClick={() => { updateURL('type', 'UP Housing'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">UP Housing</button>
                        <button onClick={() => { updateURL('type', 'Non-UP Housing'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Non-UP Housing</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Men's</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Women's</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Coed</button>
                        <button onClick={() => { updateURL('type', null); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500">Clear Filter</button>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input 
                    type="text" 
                    placeholder="Search for accommodations..." 
                    className="w-full h-[5vh] rounded-full border border-[#567375] bg-transparent py-2 pl-10 pr-4 text-sm text-[#1C2632] placeholder-[#567375]/70 focus:outline-none focus:ring-2 focus:ring-[#C9642A] focus:border-transparent transition-all"
                    onChange={(e) => console.log(e.target.value)} // Logic for filtering goes here
                />
            </div>

            {/* Sort Section */}
            <div className="relative">
                <button 
                    onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                    className="flex items-center gap-4 text-m font-semibold text-[#C9642A]"
                >
                    Sort By
                </button>
                {isSortOpen && (
                    <div className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 text-black">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Price</button>
                    </div>
                )}
            </div>
        </div>
    );
}