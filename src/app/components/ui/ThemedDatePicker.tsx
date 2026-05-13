"use client";

import React from "react";
import DatePicker from "react-datepicker";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseISO, format } from "date-fns";

interface ThemedDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  className?: string;
  id?: string;
}

export default function ThemedDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  className = "",
  id,
}: ThemedDatePickerProps) {
  const selectedDate = value ? parseISO(value) : null;
  const min = minDate ? parseISO(minDate) : undefined;
  const max = maxDate ? parseISO(maxDate) : undefined;

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full">
        <DatePicker
          id={id}
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
            } else {
              onChange("");
            }
          }}
          minDate={min}
          maxDate={max}
          placeholderText={placeholder}
          autoComplete="off"
          className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-4 py-2 pr-10 text-sm text-[#1C2632] focus:outline-none focus:ring-2 focus:ring-[#C9642A] cursor-pointer"
          wrapperClassName="w-full"
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#567375] pointer-events-none" />
      </div>
    </div>
  );
}
