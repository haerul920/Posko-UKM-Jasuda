"use client";

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="w-full flex flex-col gap-8 animate-pulse">
      {/* Fake Header/Title Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
            <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
            <div className="w-72 h-4 bg-slate-200 rounded-md"></div>
        </div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Fake Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-slate-200 rounded-md"></div>
                    <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
            </div>
        ))}
      </div>

      {/* Fake Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-t-2xl border-x border-t border-slate-200 mt-4">
        <div className="w-64 h-10 bg-slate-100 rounded-xl"></div>
        <div className="w-24 h-10 bg-slate-100 rounded-xl"></div>
      </div>

      {/* Fake Table */}
      <div className="bg-white border border-slate-200 rounded-b-2xl overflow-hidden">
        <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-6">
            <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-16 border-b border-slate-100 flex items-center px-6 gap-6">
                <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
                <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
                <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
                <div className="w-1/4 flex justify-end gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-md"></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-md"></div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
