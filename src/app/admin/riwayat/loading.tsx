import React from 'react';

export default function RiwayatLoading() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-32 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="w-full md:w-96 h-10 bg-slate-200 rounded-lg"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-lg"></div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-6">
          <div className="w-12 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/3 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/6 h-4 bg-slate-200 rounded-md ml-auto"></div>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 border-b border-slate-100 flex items-center px-6 gap-6">
            <div className="w-10 h-10 rounded-full bg-slate-100"></div>
            <div className="w-1/4 flex flex-col gap-2"><div className="w-32 h-4 bg-slate-100 rounded-md"></div><div className="w-20 h-3 bg-slate-100 rounded-md"></div></div>
            <div className="w-1/3 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-24 h-4 bg-slate-100 rounded-md ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
