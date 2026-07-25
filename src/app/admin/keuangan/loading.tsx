import React from 'react';

export default function KeuanganLoading() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-center"><div className="w-24 h-4 bg-slate-200 rounded-md"></div><div className="w-10 h-10 rounded-full bg-slate-100"></div></div>
            <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
            <div className="w-20 h-4 bg-slate-100 rounded-md"></div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mt-2">
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-6">
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
          <div className="w-1/4 h-4 bg-slate-200 rounded-md"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-6">
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md"></div>
            <div className="w-1/4 h-8 bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
