"use client";

import React, { useState } from "react";
import { ChevronDown, List } from "lucide-react";

interface CustomRowSelectProps {
  value: number;
  onChange: (val: number) => void;
  options?: number[];
  className?: string;
}

export const CustomRowSelect = React.memo(function CustomRowSelect({
  value,
  onChange,
  options = [5, 10, 30, 50],
  className = "w-32",
}: CustomRowSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full h-10 flex items-center justify-between gap-2 bg-white border border-slate-200/80 rounded-lg px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light shadow-sm transition-all duration-300 cursor-pointer hover:bg-slate-50"
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <List className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">{value} baris</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-full origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col p-1.5 gap-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md text-left transition-all cursor-pointer whitespace-nowrap ${
                  value === opt
                    ? "bg-ocean-light/10 text-ocean-light font-bold backdrop-blur-md border border-ocean-light/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {opt} baris
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
