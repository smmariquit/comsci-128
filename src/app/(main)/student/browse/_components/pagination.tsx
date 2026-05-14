"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-3 mt-8">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#C9642A] border border-[#C9642A] hover:bg-[#C9642A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#C9642A]"
            >
                Previous
            </button>

            <span className="text-sm text-[#1C2632]">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#C9642A] border border-[#C9642A] hover:bg-[#C9642A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#C9642A]"
            >
                Next
            </button>
        </div>
    );
}