"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder, className = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border rounded-lg py-2.5 px-4 text-sm transition-all duration-300 shadow-sm focus:outline-none ${
          isOpen
            ? "border-ocean-light ring-2 ring-ocean-light/50 text-ocean-dark"
            : "border-slate-300 text-slate-900 hover:border-slate-400"
        } ${className}`}
      >
        <span className={selectedOption ? "text-slate-900 font-medium" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder || "Pilih opsi"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-ocean-light" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  value === opt.value
                    ? "bg-ocean-light/10 text-ocean-dark font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4 text-ocean-dark" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
