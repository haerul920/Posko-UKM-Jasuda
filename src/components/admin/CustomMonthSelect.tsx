"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const monthsList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface CustomMonthSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const CustomMonthSelect = React.memo(function CustomMonthSelect({
  value,
  onChange,
  className = "",
}: CustomMonthSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialYear = parseInt(value.split(" ")[1]) || 2026;
  const [viewYear, setViewYear] = useState(initialYear);

  const handleOpen = () => {
    setViewYear(parseInt(value.split(" ")[1]) || 2026);
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative flex text-left group/select ${className || "w-44"}`}>
      <button
        type="button"
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full h-10 flex items-center justify-between gap-2 bg-white border border-slate-200/80 rounded-lg px-4 text-slate-700 hover:text-ocean-dark hover:bg-ocean-light/5 hover:border-ocean-light/30 transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 opacity-70 group-hover/select:text-ocean-dark transition-colors" />
          <span className="text-sm font-bold whitespace-nowrap">{value}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover/select:text-ocean-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setViewYear((v) => v - 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="font-bold text-slate-700">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((v) => v + 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="p-3 grid grid-cols-3 gap-2">
            {monthsList.map((m) => {
              const optionValue = `${m} ${viewYear}`;
              const isSelected = value === optionValue;
              return (
                <button
                  key={m}
                  onClick={() => {
                    onChange(optionValue);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? "bg-ocean-light text-white shadow-sm font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {m.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
