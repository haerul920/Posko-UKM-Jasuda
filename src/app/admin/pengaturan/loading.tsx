import React from 'react';

export default function PengaturanLoading() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-md"></div>
        </div>
      </div>
      <div className="flex gap-6 border-b border-slate-200 pb-2">
        <div className="w-24 h-8 bg-slate-200 rounded-md"></div>
        <div className="w-24 h-8 bg-slate-100 rounded-md"></div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mt-4">
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-6">
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-6">
            <div className="w-1/4 flex gap-3 items-center"><div className="w-8 h-8 rounded-full bg-slate-100"></div><div className="w-24 h-4 bg-slate-100 rounded-md"></div></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-8 bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
