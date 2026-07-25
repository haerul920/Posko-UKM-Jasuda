"use client";

import React from 'react';

export default function PublicLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      {/* Fake Header Skeleton */}
      <div className="w-full h-18 sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-surface-container-high shadow-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-40 h-8 bg-surface-container-high rounded-full animate-pulse"></div>
          <div className="hidden md:flex gap-4">
            <div className="w-20 h-5 bg-surface-container-high rounded-md animate-pulse"></div>
            <div className="w-20 h-5 bg-surface-container-high rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full">
        {/* Fake Hero Section */}
        <div className="w-full h-80 bg-surface-container rounded-b-[3rem] animate-pulse relative overflow-hidden flex flex-col items-center justify-center p-8">
            <div className="w-3/4 max-w-2xl h-12 bg-surface-container-highest rounded-lg mb-6"></div>
            <div className="w-1/2 max-w-lg h-6 bg-surface-container-highest rounded-md mb-8"></div>
            <div className="w-48 h-12 rounded-full bg-surface-container-highest"></div>
        </div>

        {/* Fake Content Area (Filter & Grid) */}
        <div className="max-w-7xl mx-auto w-full px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="w-48 h-8 bg-surface-container-high rounded-md animate-pulse"></div>
                <div className="w-32 h-10 bg-surface-container-high rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="bg-white rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col">
                        <div className="h-48 bg-surface-container animate-pulse"></div>
                        <div className="p-5 flex flex-col gap-4">
                            <div className="w-3/4 h-5 bg-surface-container-high rounded-md animate-pulse"></div>
                            <div className="w-1/2 h-4 bg-surface-container rounded-md animate-pulse"></div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="w-24 h-6 bg-surface-container-high rounded-md animate-pulse"></div>
                                <div className="w-8 h-8 bg-surface-container rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
