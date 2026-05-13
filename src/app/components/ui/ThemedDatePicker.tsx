"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = d.toISOString().split("T")[0];
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const sel = new Date(value);
    return (
      day === sel.getDate() &&
      viewDate.getMonth() === sel.getMonth() &&
      viewDate.getFullYear() === sel.getFullYear()
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const disabled = isDateDisabled(d);
    days.push(
      <button
        key={d}
        type="button"
        disabled={disabled}
        onClick={() => handleDateSelect(d)}
        className={`h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all ${
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : isSelected(d)
            ? "bg-[#C9642A] text-white font-bold"
            : isToday(d)
            ? "border border-[#C9642A] text-[#C9642A]"
            : "hover:bg-[#EDE9DE] text-[#1C2632]"
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="flex items-center gap-2 cursor-pointer w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative w-full">
           <input
            id={id}
            type="text"
            readOnly
            value={value || ""}
            placeholder={placeholder}
            className="w-full h-full min-h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-4 py-2 pr-10 text-sm text-[#1C2632] focus:outline-none focus:ring-2 focus:ring-[#C9642A] cursor-pointer"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#567375]" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-[#EDE9DE] w-[280px] left-0 md:left-auto md:right-0 animate-in fade-in zoom-in duration-150">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#EDE9DE] rounded-full transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-[#1C2632]" />
            </button>
            <div className="font-bold text-[#1C2632] text-sm">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#EDE9DE] rounded-full transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-[#1C2632]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-[#567375] uppercase tracking-tighter">
                {day}
              </div>
            ))}
            {days}
          </div>
          
          <div className="mt-2 pt-2 border-t border-[#EDE9DE] flex justify-between items-center">
            <button
               type="button"
               onClick={() => { onChange(""); setIsOpen(false); }}
               className="text-[10px] text-[#C9642A] font-bold uppercase hover:underline"
            >
              Clear
            </button>
            <button
               type="button"
               onClick={() => {
                 const today = new Date().toISOString().split("T")[0];
                 onChange(today);
                 setIsOpen(false);
               }}
               className="text-[10px] text-[#567375] font-bold uppercase hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
